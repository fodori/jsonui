import Ajv, { type ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'
import { Store, resolveStorePath } from '../store/store.js'
import { ERROR_STORE_SUFFIX } from '../util/contants.js'
import { PathModifier } from '../util/types.js'

export interface ValidationRule {
  schema: unknown
  path: string
  store: string
}

/** Nested maps may be missing until first validator is registered for a path. */
export type ValidationRegistry = Partial<Record<string, Partial<Record<string, ValidateFunction[]>>>>

// Inline (field-level) validation spec defined on a node via `$validation`.
export interface InlineValidationSpec {
  store: string
  path: string // may be absolute or relative
  schema: unknown
}

let inlineAjv: Ajv | null = null

function getInlineAjv(): Ajv {
  if (!inlineAjv) {
    inlineAjv = new Ajv({ allErrors: true, strict: false })
    addFormats(inlineAjv)
    ajvErrors(inlineAjv)
  }
  return inlineAjv
}

export function buildValidationRegistry(rules?: ValidationRule[]): ValidationRegistry {
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
 * - Respects $validation.store and $validation.path.
 * - If the path is relative (does not start with '/'), it is resolved using
 *   resolveStorePath with currentPath and pathModifiers so list items and
 *   global path modifiers work as expected.
 * - Writes errors to `${store}.error` at the resolved logical path, but only
 *   if the error value actually changes.
 */
export function runInlineValidation(spec: InlineValidationSpec, store: Store, currentPath: string, pathModifiers?: PathModifier): void {
  if (!spec.store || !spec.path || spec.schema == null) return

  const storeName = spec.store
  const logicalPath = resolveStorePath(spec.path, currentPath, pathModifiers, storeName)

  const errorStoreName = `${storeName}${ERROR_STORE_SUFFIX}`
  const value = store.getForStore(storeName, logicalPath)

  const ajv = getInlineAjv()
  const validate = ajv.compile(spec.schema)
  const messages: string[] = []
  const valid = validate(value)
  if (!valid && validate.errors) {
    for (const err of validate.errors) {
      if (err.message) messages.push(err.message)
    }
  }

  const newError = messages.length > 0 ? messages.join('; ') : undefined
  const currentError = store.getForStore(errorStoreName, logicalPath)

  if (currentError === newError) return

  if (messages.length > 0) {
    store.setForStore(errorStoreName, logicalPath, newError, false)
  } else {
    store.setForStore(errorStoreName, logicalPath, undefined, false)
  }
}

export function runValidationsForPath(registry: ValidationRegistry, store: Store, storeName: string, path: string): void {
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
    const existingSubtree = store.getForStore(errorStoreName, rulePath)
    if (existingSubtree !== undefined) {
      collectExistingPaths(rulePath === '' ? '/' : rulePath, existingSubtree)
    }

    const valueAtRulePath = store.getForStore(storeName, rulePath)
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
    const newError = messages.length > 0 ? messages.join('; ') : undefined
    const currentError = store.getForStore(errorStoreName, targetPath)
    if (currentError === newError) continue
    store.setForStore(errorStoreName, targetPath, newError, false)
  }
}

/** Match whole segments only; works for paths of any depth (e.g. /a/b/0/c). */
function isPathPrefix(rulePath: string, targetPath: string): boolean {
  const r = rulePath === '' ? '/' : rulePath
  const t = targetPath === '' ? '/' : targetPath

  if (r === '/') return true
  if (t === r) return true
  return t.startsWith(r.endsWith('/') ? r : `${r}/`)
}
