import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'
import type { FormStore } from '../store/formStore.js'
import { ERROR_STORE_SUFFIX } from '../util/contants.js'
import { InlineValidationSpec, JSONParams, ModifierContext, ModifierMap, ValidationRegistry, ValidationRule } from '../util/types.js'
import { resolveModifier } from './resolveModifier.js'

let inlineAjv: Ajv | null = null

const getInlineAjv = (): Ajv => {
  if (!inlineAjv) {
    // TODO why it's no strict?
    inlineAjv = new Ajv({ allErrors: true, strict: false })
    addFormats(inlineAjv)
    ajvErrors(inlineAjv)
  }
  return inlineAjv
}

const stringifyValidationError = (error: unknown): string => {
  if (typeof error === 'string') return error
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  try {
    return String(error)
  } catch {
    return 'error'
  }
}

export const buildValidationRegistry = (rules?: ValidationRule[]): ValidationRegistry => {
  const registry: ValidationRegistry = {}
  if (!Array.isArray(rules) || rules.length === 0) return registry

  const ajv = new Ajv({ allErrors: true, strict: false })
  // TODO: check test how looks like in jsonui
  addFormats(ajv)
  ajvErrors(ajv)

  for (const rule of rules) {
    if (rule.schema === undefined || rule.schema === null || !rule.store || !rule.path) continue

    const schema = (rule as Partial<ValidationRule>).schema
    const store = (rule as Partial<ValidationRule>).store
    const path = (rule as Partial<ValidationRule>).path

    if (schema === undefined || schema === null) continue
    if (typeof store !== 'string' || store.length === 0) continue
    if (typeof path !== 'string' || path.length === 0) continue

    const validate = ajv.compile(schema)
    const byStore = registry[store] ?? (registry[store] = {})
    const list = byStore[path] ?? (byStore[path] = [])
    list.push(validate)
  }

  return registry
}

/**
 * Evaluate a single inline validation spec and return its error message, if any.
 * Does not write to the error store.
 */
export const evaluateInlineValidation = async (
  spec: InlineValidationSpec,
  value: unknown,
  modifiers: ModifierMap,
  ctx: ModifierContext
): Promise<string | null> => {
  if (spec.schema != null) {
    const ajv = getInlineAjv()
    const validate = ajv.compile(spec.schema)
    const messages: string[] = []
    const valid = validate(value)
    if (!valid && validate.errors) {
      for (const err of validate.errors) {
        if (err.message) messages.push(err.message)
      }
    }
    return messages.length > 0 ? messages.join('; ') : null
  }

  if (spec.jsonataDef != null) {
    let result: unknown
    try {
      const jsonata = (await import('jsonata')).default
      const expr = jsonata(spec.jsonataDef)
      result = await expr.evaluate(value)
    } catch (e) {
      result = stringifyValidationError(e)
    }

    const hasError = result !== null && result !== undefined && result !== '' && result !== true
    if (!hasError) return null
    return spec.errorMessage ? String(await resolveModifier(spec.errorMessage, modifiers, ctx)) : String(result)
  }

  return null
}

const writeInlineValidationError = (
  formStore: FormStore,
  errorStoreName: string,
  componentLogicalPath: string,
  newError: string | null,
  notify: boolean
): void => {
  const currentError = formStore.get(errorStoreName, componentLogicalPath)
  if ((currentError ?? null) === newError) return
  formStore.set(errorStoreName, componentLogicalPath, newError, false, notify)
}

/**
 * Run all inline validation specs for a field, aggregate messages, and write once.
 */
export const runInlineValidations = async (
  specs: InlineValidationSpec[],
  componentStoreName: string,
  componentLogicalPath: string,
  modifiers: ModifierMap,
  ctx: ModifierContext,
  options?: { notify?: boolean }
): Promise<void> => {
  const { formStore } = ctx
  const errorStoreName = `${componentStoreName}${ERROR_STORE_SUFFIX}`
  const value = formStore.get(componentStoreName, componentLogicalPath)
  const notify = options?.notify !== false
  const messages: string[] = []

  for (const spec of specs) {
    if (typeof spec !== 'object') continue
    const message = await evaluateInlineValidation(spec, value, modifiers, ctx)
    if (message) messages.push(message)
  }

  const newError: string | null = messages.length > 0 ? messages.join('; ') : null
  writeInlineValidationError(formStore, errorStoreName, componentLogicalPath, newError, notify)
}

/**
 * Run a single inline (field-level) validation spec against the current store state.
 *
 * The component's own store name and resolved logical path are passed in directly —
 * they come from the simplified component's `store`/`path` props, not from the spec.
 *
 * Supports two validation styles:
 *   - schema: AJV JSON Schema validation
 *   - jsonataDef + errorMessage (not mandatory): JSONata expression; error shown when result is
 *     not null, undefined, empty string, or true. errorMessage may be a plain string
 *     or a { $modifier: ... } expression resolved via resolveModifier.
 */
export const runInlineValidation = async (
  spec: InlineValidationSpec,
  componentStoreName: string,
  componentLogicalPath: string,
  modifiers: ModifierMap,
  ctx: ModifierContext,
  options?: { notify?: boolean }
): Promise<void> => {
  const { formStore } = ctx
  const errorStoreName = `${componentStoreName}${ERROR_STORE_SUFFIX}`
  const value = formStore.get(componentStoreName, componentLogicalPath)
  const notify = options?.notify !== false
  const newError = await evaluateInlineValidation(spec, value, modifiers, ctx)
  writeInlineValidationError(formStore, errorStoreName, componentLogicalPath, newError, notify)
}

// Runs all validators whose rule path matches the changed path prefix for the given store.
// Aggregates current validation messages and writes or clears them in the matching .error store paths.
export const runValidationsForPath = (registry: ValidationRegistry, formStore: FormStore, storeName: string, path: string): void => {
  const storeValidators = registry[storeName]

  // No validators registered for this store at all
  if (!storeValidators) {
    return
  }

  const errorStoreName = `${storeName}${ERROR_STORE_SUFFIX}`

  // Collect new error messages per *concrete* target path (e.g. '/players/0/score').
  const perPathMessages: Partial<Record<string, string[]>> = {}
  const affectedErrorPaths = new Set<string>()

  // Include any existing error leaf paths under matching rule paths so we can clear
  // them if they become valid.
  const collectExistingPaths = (basePath: string, value: unknown): void => {
    if (value == null) return
    if (typeof value !== 'object') {
      affectedErrorPaths.add(basePath)
      return
    }
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        collectExistingPaths(`${basePath}/${i}`, v)
      })
      return
    }
    for (const [k, v] of Object.entries(value as JSONParams)) {
      const encodedKey = k.replace(/~/g, '~0').replace(/\//g, '~1')
      collectExistingPaths(basePath === '/' ? `/${encodedKey}` : `${basePath}/${encodedKey}`, v)
    }
  }

  // Run all validators whose rule path is a prefix of the affected path.
  // Example: action path '/a/b/c' should trigger validators registered for
  // '/', '/a', '/a/b', and '/a/b/c'.
  for (const [rulePath, validators] of Object.entries(storeValidators)) {
    if (!Array.isArray(validators) || validators.length === 0) continue
    if (!isPathPrefix(rulePath, path)) continue

    // Track existing error paths under this rule so we can clear them.
    const existingSubtree = formStore.get(errorStoreName, rulePath)
    if (existingSubtree !== undefined) {
      collectExistingPaths(rulePath === '' ? '/' : rulePath, existingSubtree)
    }

    const valueAtRulePath = formStore.get(storeName, rulePath)
    for (const validate of validators) {
      const valid = validate(valueAtRulePath)
      if (!valid && validate.errors) {
        for (const err of validate.errors) {
          if (!err.message) continue
          const instancePath = typeof err.instancePath === 'string' ? err.instancePath : ''
          // instancePath is relative to rulePath, e.g. '/0/score'
          let targetPath: string
          if (rulePath === '' || rulePath === '/') {
            // When instancePath is empty, the error is at the root of the validated object.
            // Store at '/~1' (JSON Pointer for key '/') to avoid overwriting the entire error store.
            targetPath = instancePath && instancePath.length > 0 ? instancePath : '/~1'
          } else {
            targetPath = instancePath && instancePath.length > 0 ? `${rulePath}${instancePath}` : rulePath
          }
          const list = perPathMessages[targetPath] ?? (perPathMessages[targetPath] = [])
          list.push(err.message)
          affectedErrorPaths.add(targetPath)
        }
      }
    }
  }

  // Apply updates for all affected error paths (both existing and new).
  for (const targetPath of affectedErrorPaths) {
    const messages = perPathMessages[targetPath] ?? []
    const newError: string | null = messages.length > 0 ? messages.join('; ') : null
    const currentError = formStore.get(errorStoreName, targetPath)
    if ((currentError ?? null) === newError) continue
    formStore.set(errorStoreName, targetPath, newError, false)
  }
}

/** Match whole segments only; works for paths of any depth (e.g. /a/b/0/c). */
const isPathPrefix = (rulePath: string, targetPath: string): boolean => {
  const r = rulePath === '' ? '/' : rulePath
  const t = targetPath === '' ? '/' : targetPath

  if (r === '/') return true
  if (t === r) return true
  return t.startsWith(r.endsWith('/') ? r : `${r}/`)
}
