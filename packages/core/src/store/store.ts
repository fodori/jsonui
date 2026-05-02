/**
 * Tree-shaped state management with multiple stores.
 * Similar to Redux but tailored for JSON UI: per-store trees, JSON Pointer paths.
 *
 * Store paths are unbounded and can be arbitrarily nested (objects and arrays),
 * e.g. /a/b/c/2/d/e/0/f. Logical paths are resolved via resolveStorePath and
 * applied consistently in getForStore/setForStore.
 */

import { TOUCH_STORE_SUFFIX, ERROR_STORE_SUFFIX, STORE_ROOT_PATH } from '../util/contants.js'
import { cloneDeep } from '../util/helpers.js'
import { get as ptrGet, resolvePath, normalizePath, parsePath } from '../util/json-pointer.js'
import type { JSONValue, PathModifier } from '../util/types.js'

export type StoreState = Record<string, unknown>
export type Listener = () => void
export type StoreChangeListener = (storeName: string, logicalPath: string) => void

function isTouchOrErrorShadowStore(storeName: string): boolean {
  return storeName.endsWith(TOUCH_STORE_SUFFIX) || storeName.endsWith(ERROR_STORE_SUFFIX)
}

export class Store {
  private state: StoreState = {}
  private listeners = new Set<Listener>()
  private changeListeners = new Set<StoreChangeListener>()

  getState(): Readonly<StoreState> {
    return this.state
  }

  /**
   * Logical JsonUI stores snapshot — same shape as `JsonUI` `defaultValues`:
   * `{ data: {...}, "data.touch": {...}, "data.error": {...} }`.
   * Omits the internal `/storeRoot` wrapper returned by {@link getState}.
   */
  getLogicalStoresMap(): Record<string, JSONValue> {
    const slice = ptrGet(this.state, STORE_ROOT_PATH)
    if (slice === undefined || slice === null || typeof slice !== 'object' || Array.isArray(slice)) {
      return {}
    }
    return cloneDeep(slice) as Record<string, JSONValue>
  }

  get(path: string): unknown {
    const value = ptrGet(this.state, path)
    return cloneDeep(value)
  }

  set(path: string, value: unknown): void {
    this.state = setImmutable(this.state, path, value)
    this.notify()
  }

  /**
   * Convenience helpers that work with logical store names and logical paths,
   * instead of requiring callers to compose `/storeRoot/{storeName}/...`.
   *
   * Store isolation: each storeName (e.g. "data", "data.error", "data.touch") is
   * a distinct store. getForStore/setForStore only read/write that store's subtree;
   * "data.error" cannot access "data" or any other store.
   *
   * When trackTouch is true, setForStore also writes to `${storeName}.touch` at
   * the same logicalPath; path normalization applies (no empty segments).
   */
  setForStore(storeName: string, logicalPath: string, value: unknown, trackTouch = true): void {
    const internalPath = makeStorePath(storeName, logicalPath)
    this.set(internalPath, value)

    if (trackTouch && !isTouchOrErrorShadowStore(storeName)) {
      const touchStoreName = `${storeName}${TOUCH_STORE_SUFFIX}`
      this.set(makeStorePath(touchStoreName, logicalPath), true)
    }

    // Notify fine-grained listeners with logical store name + path so
    // JsonUI can re-resolve only components that depend on this slice.
    this.notifyChange(storeName, logicalPath)
  }

  getForStore(storeName: string, logicalPath: string): unknown {
    const internalPath = makeStorePath(storeName, logicalPath)
    return this.get(internalPath)
  }

  update(path: string, updater: (current: unknown) => unknown): void {
    const current = this.get(path)
    this.set(path, updater(current))
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    this.listeners.forEach((l) => l())
  }

  subscribeChange(listener: StoreChangeListener): () => void {
    this.changeListeners.add(listener)
    return () => this.changeListeners.delete(listener)
  }

  private notifyChange(storeName: string, logicalPath: string): void {
    this.changeListeners.forEach((l) => l(storeName, logicalPath))
  }

  replaceState(state: StoreState): void {
    this.state = state
    this.notify()
  }
}

export function makeStorePath(storeName: string, path: string): string {
  if (!storeName || storeName.length === 0) {
    throw new Error('storeName must be a non-empty string')
  }
  const base = `${STORE_ROOT_PATH}/${storeName}`
  const normalized = normalizePath(path)
  if (normalized === '/') return base
  return base + normalized
}

/**
 * Immutable variant of ptrSet: returns a new root object with the change applied,
 * without mutating the original tree. Only the objects/arrays along the path are
 * shallow-copied; unrelated subtrees are structurally shared for performance.
 */
function setImmutable(root: StoreState, pathStr: string, value: unknown): StoreState {
  const segments = parsePath(pathStr)
  if (segments.length === 0) return root

  const originalRoot = root

  function cloneContainer(container: unknown): Record<string, unknown> | unknown[] {
    if (Array.isArray(container)) {
      return (container as unknown[]).slice()
    }
    if (container && typeof container === 'object') {
      return { ...(container as Record<string, unknown>) }
    }
    return {}
  }

  function setAt(current: unknown, index: number): { cloned: Record<string, unknown> | unknown[]; result: unknown } {
    const isLast = index === segments.length - 1
    const seg = segments[index]
    const container = cloneContainer(current)

    if (isLast) {
      const lastSeg = seg
      const lastKey = lastSeg === '' || /^\d+$/.test(lastSeg) ? parseInt(lastSeg, 10) : lastSeg

      if (Array.isArray(container)) {
        container[lastKey as number] = value
      } else {
        container[lastSeg] = value
      }

      return { cloned: container, result: container }
    }

    const nextSeg = segments[index + 1]
    const nextKey = nextSeg === '' || /^\d+$/.test(nextSeg) ? parseInt(nextSeg, 10) : nextSeg

    // Non-last segment: ensure child container exists before descending.
    const keyForChild: string | number = seg
    let next = Array.isArray(container) && /^\d+$/.test(seg) ? container[parseInt(seg, 10)] : (container as Record<string, unknown>)[seg]

    if (
      next == null ||
      typeof next !== 'object' ||
      (Array.isArray(next) && typeof nextKey === 'string') ||
      (!Array.isArray(next) && typeof nextKey === 'number')
    ) {
      next = typeof nextKey === 'number' ? [] : {}
    }

    const { result: childClone } = setAt(next, index + 1)

    if (Array.isArray(container) && /^\d+$/.test(String(keyForChild))) {
      container[parseInt(String(keyForChild), 10)] = childClone
    } else {
      ;(container as Record<string, unknown>)[String(keyForChild)] = childClone
    }

    return { cloned: container, result: container }
  }

  const { result } = setAt(originalRoot, 0)
  return result as StoreState
}

/**
 * Resolve a path for a given store, using pathModifiers (from list context) and currentPath for relative paths.
 * - Absolute path: /firstname -> unchanged (then normalized).
 * - Relative path: firstname -> resolved against currentPath (or pathModifiers[storeName] when in list context).
 * - pathModifiers apply per store: only pathModifiers[storeName] is used for that store; "data.error" cannot
 *   access "data" or any other store.
 * Returns a normalized path (no empty segments, no trailing slash).
 */
export function resolveStorePath(pathStr: string, currentPath: string, pathModifiers?: PathModifier, storeName?: string): string {
  let resolved: string
  const modifier =
    pathModifiers !== undefined && storeName !== undefined && Object.prototype.hasOwnProperty.call(pathModifiers, storeName)
      ? pathModifiers[storeName]
      : undefined
  if (modifier !== undefined) {
    resolved = resolvePath(modifier.path, pathStr)
  } else if (pathStr.startsWith('/')) {
    resolved = pathStr
  } else {
    resolved = resolvePath(currentPath, pathStr)
  }
  return normalizePath(resolved)
}
