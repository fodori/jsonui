import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'
import type { FormStore } from '../store/formStore.js'
import { ERROR_STORE_SUFFIX } from '../util/contants.js'
import { InlineValidationSpec, ModifierContext, ModifierMap, ValidationRegistry, ValidationRule } from '../util/types.js'
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

export const buildValidationRegistry = (rules?: ValidationRule[]): ValidationRegistry => {
  const registry: ValidationRegistry = {}
  if (!rules || rules.length === 0) return registry

  const ajv = new Ajv({ allErrors: true, strict: false })
  // TODO: check test how looks like in jsonui
  addFormats(ajv)
  ajvErrors(ajv)

  for (const rule of rules) {
    if (rule.schema === undefined || rule.schema === null || !rule.store || !rule.path) continue
    const validate = ajv.compile(rule.schema)
    const byStore = registry[rule.store] ?? (registry[rule.store] = {})
    const list = byStore[rule.path] ?? (byStore[rule.path] = [])
    list.push(validate)
  }

  return registry
}

/**
 * Run a single inline (field-level) validation spec against the current store state.
 *
 * The component's own store name and resolved logical path are passed in directly —
 * they come from the simplified component's `store`/`path` props, not from the spec.
 *
 * Supports two validation styles:
 *   - schema: AJV JSON Schema validation
 *   - jsonataDef + errorMessage: JSONata expression; error shown when result is
 *     not null, undefined, empty string, or true. errorMessage may be a plain string
 *     or a { $modifier: ... } expression resolved via resolveModifier.
 */
export const runInlineValidation = async (
  spec: InlineValidationSpec,
  componentStoreName: string,
  componentLogicalPath: string,
  modifiers: ModifierMap,
  ctx: ModifierContext
): Promise<void> => {
  const { formStore } = ctx
  const errorStoreName = `${componentStoreName}${ERROR_STORE_SUFFIX}`
  const value = formStore.get(componentStoreName, componentLogicalPath)

  if (spec.schema != null) {
    const ajv = getInlineAjv()
    const validate = ajv.compile(spec.schema)
    const messages: string[] = []
    const valid = validate(value)
    //TODO: need to outsource validation to separate function and test it
    if (!valid && validate.errors) {
      for (const err of validate.errors) {
        if (err.message) messages.push(err.message)
      }
    }

    const newError: string | null = messages.length > 0 ? messages.join('; ') : null
    const currentError = formStore.get(errorStoreName, componentLogicalPath)
    if ((currentError ?? null) !== newError) {
      formStore.set(errorStoreName, componentLogicalPath, newError, false)
    }
    return
  }

  if (spec.jsonataDef != null) {
    let result: unknown
    try {
      const jsonata = (await import('jsonata')).default
      const expr = jsonata(spec.jsonataDef)
      result = await expr.evaluate(value)
    } catch (e) {
      if (typeof e === 'string') {
        result = e
      } else if (typeof e === 'object' && e !== null && 'message' in e && typeof e.message === 'string') {
        result = e.message
      } else {
        try {
          result = String(e)
        } catch {
          result = 'error'
        }
      }
    }

    const hasError = result !== null && result !== undefined && result !== '' && result !== true

    const newError: string | null = hasError ? (spec.errorMessage ? String(await resolveModifier(spec.errorMessage, modifiers, ctx)) : String(result)) : null

    const currentError = formStore.get(errorStoreName, componentLogicalPath)
    if ((currentError ?? null) !== newError) {
      formStore.set(errorStoreName, componentLogicalPath, newError, false)
    }
    return
  }
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
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      collectExistingPaths(basePath === '/' ? `/${k}` : `${basePath}/${k}`, v)
    }
  }

  // Run all validators whose rule path is a prefix of the affected path.
  // Example: action path '/a/b/c' should trigger validators registered for
  // '/', '/a', '/a/b', and '/a/b/c'.
  for (const [rulePath, validators] of Object.entries(storeValidators)) {
    if (!validators) continue
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
          const instancePath = err.instancePath
          // instancePath is relative to rulePath, e.g. '/0/score'
          let targetPath: string
          if (rulePath === '' || rulePath === '/') {
            targetPath = instancePath && instancePath.length > 0 ? instancePath : '/'
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
