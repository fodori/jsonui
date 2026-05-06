/**
 * JSON UI type definitions (framework-agnostic).
 */

import type { Store } from '../store/store.js'
import { V_COMP, V_CHILDREN } from './contants.js'
export type { Store }

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

export type PathModifier = Record<string, { path: string }>

export interface ModifierContext {
  store: Store
  currentPath: string
  pathModifiers?: PathModifier
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

export type StorePathDependency = { store: string; path: string }

export type ResolvedRenderNodeState = {
  props: Record<string, unknown>
  resolvedSlots: Record<string, unknown>
}

export interface ValidationRule {
  schema: unknown
  path: string
  store: string
}
