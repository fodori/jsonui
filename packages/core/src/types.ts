/**
 * JSON UI type definitions (framework-agnostic).
 */

import type { Store } from './store.js'

export const V_COMP = '$comp'
export const V_CHILDREN = '$children'
export const ACTION_KEY = '$action'
export const MODIFIER_KEY = '$modifier'
export const PATH_MODIFIERS_KEY = '$pathModifiers'
export const LIST_SEMAPHORE = '$isList'
export const LIST_ITEM = '$listItem'

/** Main JsonUI list pagination keys (parity). */
export const LIST_PAGE = '$page'
export const LIST_ITEM_PER_PAGE = '$itemPerPage'
export const LIST_LENGTH = '$listLength'

/** Main JsonUI nested locale blobs merged into the translation map. */
export const REF_LOCALES = '$locales'

// Store-name suffixes for parallel trees (errors, touch-state, etc.).
export const ERROR_STORE_SUFFIX = '.error'
/** Shadow store for field touched state (aligned with main JsonUI `.touch`). */
export const TOUCH_STORE_SUFFIX = '.touch'

export type JsonUIValue = string | number | boolean | null | JsonUINode | JsonUIValue[]

// Generic JSON value / object types for store contents and defaultValues
export type JSONValue = string | number | boolean | null | JSONObject | JSONValue[]

export interface JSONObject {
  [key: string]: JSONValue
}

export interface JsonUINode {
  [key: string]: unknown
  [V_COMP]?: string
  [V_CHILDREN]?: JsonUIValue
}

export type ModifierHandler = (params: Record<string, unknown>, context: ModifierContext) => unknown | Promise<unknown>

export type ActionHandler = (params: Record<string, unknown>, context: ActionContext) => void | Promise<void>

// key -> { langCode -> value }
export type TranslationsMap = Record<string, Record<string, string> | undefined>

export interface ModifierContext {
  stores: Record<string, Store>
  currentPath: string
  pathModifiers?: Record<string, { path: string }>
  // Optional validation registry (shape owned by JsonUI/validation)
  validators?: unknown
  // Optional translation map built from model.$translate
  translations?: TranslationsMap
  // Default (baseline) language of keys, e.g. "en"
  defaultLanguage?: string
  // Active language for translations, e.g. "hu"
  activeLanguage?: string
}

export type ComponentActionProps = Record<string, unknown>

export interface ActionContext extends ModifierContext {
  componentProps: ComponentActionProps
}

export type ModifierMap = Record<string, ModifierHandler | undefined>

export type ActionMap = Record<string, ActionHandler | undefined>

/** Emitted when JsonUI unmounts or when model/defaultValues/id changes (main parity). */
export interface OnStateExportProps {
  id?: string
  /** Same shape as `JsonUI` `defaultValues`: logical stores `{ data: {...}, "data.touch": {...}, ... }` (no internal `storeRoot` wrapper). */
  formState: JSONValue
}

export type OnStateExportType = (arg: OnStateExportProps) => void
