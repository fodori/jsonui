import type { FormStore, JsonUINode, ActionMap, ModifierMap, TranslationsMap, ValidationRegistry, ModifierContext } from '@jsonui/core'
import type { ComponentMap } from '../../componentMap.js'

export interface RenderNodeProps {
  node: JsonUINode
  components: ComponentMap
  modifiers: ModifierMap
  actions: ActionMap
  formStore: FormStore
  currentPath: string
  pathModifiers?: ModifierContext['pathModifiers']
  validators?: ValidationRegistry
  translations?: TranslationsMap
  defaultLanguage?: string
  activeLanguage?: string
}

export type StorePathDependency = { store: string; path: string }

export type ResolvedRenderNodeState = {
  props: JsonUINode
  resolvedSlots: JsonUINode
}
