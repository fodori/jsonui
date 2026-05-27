/**
 * JSON UI type definitions (framework-agnostic).
 */

import type { FormStore } from '../store/formStore.js'
import { V_COMP, V_CHILDREN } from './contants.js'
export type { FormStore as Store }
import { type ValidateFunction } from 'ajv'

export interface JSONObject {
  [key: string]: unknown
}

export type JsonPrimitives = string | number | boolean | null

export type JSONParams = Record<string, unknown>

export interface ComponentContext {
  actions: ActionMap
  currentPath: string
  fieldErrors?: unknown
  fieldTouched?: unknown
  formStore: FormStore
  modifiers: ModifierMap
  pathModifiers?: PathModifier
}

export interface JsonUINode {
  [key: string]: unknown
  [V_COMP]?: string
  [V_CHILDREN]?: unknown
  $ctx?: ComponentContext
}

export type ModifierHandler = (params: JSONParams, context: ModifierContext) => unknown | Promise<unknown>

export type ActionHandler = (params: JSONParams, context: ActionContext) => void | Promise<void>

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

export interface ActionContext extends ModifierContext {
  componentProps: JSONParams
  validators?: ValidationRegistry
}

export type ModifierMap = Record<string, ModifierHandler | undefined>

export type ActionMap = Record<string, ActionHandler | undefined>

/** Emitted when JsonUI unmounts or when model/defaultValues/id changes (main parity). */
export interface OnStateExportProps {
  id?: string
  /** Same shape as `JsonUI` `defaultValues`: logical stores `{ data: {...}, "data.touch": {...}, ... }` (no internal `storeRoot` wrapper). */
  formState: unknown
}

export type OnStateExportType = (arg: OnStateExportProps) => void

export type StorePathDependency = { store: string; path: string }

export type ResolvedRenderNodeState = {
  props: JSONParams
  resolvedSlots: JSONParams
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
