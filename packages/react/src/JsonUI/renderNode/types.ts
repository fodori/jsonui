import type { Store, JsonUINode, FunctionMap, TranslationsMap, ValidationRegistry } from '@jsonui/core'
import type { ComponentMap } from '../../componentMap.js'

export interface RenderNodeProps {
  node: JsonUINode
  components: ComponentMap
  functions: FunctionMap
  stores: Record<string, Store>
  currentPath: string
  pathModifiers?: Record<string, { path: string }>
  validators?: ValidationRegistry
  translations?: TranslationsMap
  defaultLanguage?: string
  activeLanguage?: string
}

export type StorePathDependency = { store: string; path: string }

export type ResolvedRenderNodeState = {
  props: Record<string, unknown>
  resolvedSlots: Record<string, unknown>
}
