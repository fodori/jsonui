export type StorePathDependency = { store: string; path: string }

export type ResolvedRenderNodeState = {
  props: Record<string, unknown>
  resolvedSlots: Record<string, unknown>
}
