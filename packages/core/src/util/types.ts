/**
 * JSON UI type definitions (framework-agnostic).
 */

import type { FormStore } from '../store/formStore.js'
import { V_COMP, V_CHILDREN } from './contants.js'
export type { FormStore as Store }
import { type ValidateFunction } from 'ajv'

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
  formStore: FormStore
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
  validators?: ValidationRegistry
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

/** Nested maps may be missing until first validator is registered for a path. */
export type ValidationRegistry = Partial<Record<string, Partial<Record<string, ValidateFunction[]>>>>

// Inline (field-level) validation spec defined on a node via `$validations`.
// store and path come from the simplified component, not from the spec itself.
export interface InlineValidationSpec {
  // Schema-based validation (AJV)
  schema?: unknown
  // JSONata-based validation: error shown when result is not null/undefined/""/true
  jsonataDef?: string
  // Error message shown for jsonataDef validation failures.
  // May be a plain string or a { $modifier: ... } expression.
  errorMessage?: unknown
}
