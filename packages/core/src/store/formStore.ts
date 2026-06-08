/**
 * Tree-shaped state management with multiple stores.
 * Similar to Redux but tailored for JSON UI: per-store trees, JSON Pointer paths.
 *
 * Store paths are unbounded and can be arbitrarily nested (objects and arrays),
 * e.g. /a/b/c/2/d/e/0/f. Logical paths are resolved via resolveStorePath and
 * applied consistently in get/set.
 */

import { TOUCH_STORE_SUFFIX, ERROR_STORE_SUFFIX, STORE_ROOT_PATH } from '../util/contants.js'
import { assertJsonCompatible, cloneDeep } from '../util/helpers.js'
import { get as ptrGet, resolvePath, normalizePath, parsePath } from '../util/json-pointer.js'
import type { JSONParams, PathModifier } from '../util/types.js'

export type StoreState = JSONParams
export type Listener = () => void
export type StoreChangeListener = (storeName: string, logicalPath: string) => void

const isTouchOrErrorShadowStore = (storeName: string): boolean => {
  return storeName.endsWith(TOUCH_STORE_SUFFIX) || storeName.endsWith(ERROR_STORE_SUFFIX)
}

export class FormStore {
  private state: StoreState = {}
  private changeListeners = new Set<StoreChangeListener>()

  getState(): Readonly<StoreState> {
    return cloneDeep(this.state)
  }

  /**
   * Logical JsonUI stores snapshot — same shape as `JsonUI` `defaultValues`:
   * `{ data: {...}, "data.touch": {...}, "data.error": {...} }`.
   * Omits the internal `/storeRoot` wrapper returned by {@link getState}.
   */
  getLogicalStoresMap(): JSONParams {
    const slice = ptrGet(this.state, STORE_ROOT_PATH)
    if (slice === undefined || slice === null || typeof slice !== 'object' || Array.isArray(slice)) {
      return {}
    }
    return cloneDeep(slice) as JSONParams
  }

  /**
   * Initialise a logical store root without marking fields as touched.
   */
  initializeStore(storeName: string, value: unknown): void {
    this.set(storeName, '/', value, false)
  }

  private getByPointer(path: string): unknown {
    const value = ptrGet(this.state, path)
    return cloneDeep(value)
  }

  private setByPointer(path: string, value: unknown): void {
    assertJsonCompatible(value)
    this.state = setImmutable(this.state, path, value)
    this.notify()
  }

  /**
   * Convenience helpers that work with logical store names and logical paths,
   * instead of requiring callers to compose `/storeRoot/{storeName}/...`.
   *
   * Store isolation: each storeName (e.g. "data", "data.error", "data.touch") is
   * a distinct store. get/set only read/write that store's subtree;
   * "data.error" cannot access "data" or any other store.
   *
   * When trackTouch is true, set also writes to `${storeName}.touch` at
   * the same logicalPath; path normalization applies (no empty segments).
   */
  set(storeName: string, logicalPath: string, value: unknown, trackTouch = true, notify = true): void {
    const internalPath = makeStorePath(storeName, logicalPath)
    this.setByPointer(internalPath, value)

    if (trackTouch && !isTouchOrErrorShadowStore(storeName)) {
      const touchStoreName = `${storeName}${TOUCH_STORE_SUFFIX}`
      this.setByPointer(makeStorePath(touchStoreName, logicalPath), true)
    }

    // Notify fine-grained listeners with logical store name + path so
    // JsonUI can re-resolve only components that depend on this slice.
    if (notify) {
      this.notifyChange(storeName, logicalPath)
    }
  }

  get(storeName: string, logicalPath: string): unknown {
    const internalPath = makeStorePath(storeName, logicalPath)
    return this.getByPointer(internalPath)
  }

  // Backward-compatible aliases for existing consumers.
  setForStore(storeName: string, logicalPath: string, value: unknown, trackTouch = true): void {
    this.set(storeName, logicalPath, value, trackTouch)
  }

  // Backward-compatible aliases for existing consumers.
  getForStore(storeName: string, logicalPath: string): unknown {
    return this.get(storeName, logicalPath)
  }

  private notify(): void {
    // No coarse-grained subscription API is exposed intentionally.
  }

  subscribeChange(listener: StoreChangeListener): () => void {
    this.changeListeners.add(listener)
    return () => this.changeListeners.delete(listener)
  }

  private notifyChange(storeName: string, logicalPath: string): void {
    this.changeListeners.forEach((l) => l(storeName, logicalPath))
  }
}

export const makeStorePath = (storeName: string, path: string): string => {
  if (!storeName || storeName.length === 0) {
    throw new Error('storeName must be a non-empty string')
  }
  const base = `${STORE_ROOT_PATH}/${storeName}`
  const pointerPath = !path || path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`
  const normalized = normalizePath(pointerPath)
  if (normalized === '/') return base
  return base + normalized
}

/**
 * Immutable variant of ptrSet: returns a new root object with the change applied,
 * without mutating the original tree. Only the objects/arrays along the path are
 * shallow-copied; unrelated subtrees are structurally shared for performance.
 */
const setImmutable = (root: StoreState, pathStr: string, value: unknown): StoreState => {
  const segments = parsePath(pathStr)
  if (segments.length === 0) return root

  const originalRoot = root

  const cloneContainer = (container: unknown): JSONParams | unknown[] => {
    if (Array.isArray(container)) {
      return (container as unknown[]).slice()
    }
    if (container && typeof container === 'object') {
      return { ...(container as JSONParams) }
    }
    return {}
  }

  const setAt = (current: unknown, index: number): { cloned: JSONParams | unknown[]; result: unknown } => {
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
    let next = Array.isArray(container) && /^\d+$/.test(seg) ? container[parseInt(seg, 10)] : (container as JSONParams)[seg]

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
      ;(container as JSONParams)[String(keyForChild)] = childClone
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
export const resolveStorePath = (pathStr: string, currentPath: string, pathModifiers?: PathModifier, storeName?: string): string => {
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
