import type { Store, JsonUINode, ActionMap, ModifierMap, TranslationsMap, ValidationRegistry } from '@jsonui/core'
import type { ComponentMap } from '../../componentMap.js'

export interface RenderNodeProps {
  node: JsonUINode
  components: ComponentMap
  modifiers: ModifierMap
  actions: ActionMap
  store: Store
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
