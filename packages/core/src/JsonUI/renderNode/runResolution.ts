import type { JsonUINode, ModifierContext, ModifierMap, PathModifier, ResolvedRenderNodeState, StorePathDependency } from '../../util/types.js'
import { resolveModifier } from '../resolveModifier.js'
import { resolveStyle } from '../../style/resolveStyle.js'
import type { StylePlatform, BreakpointKey } from '../../style/types.js'
import { runInlineValidation } from '../validation.js'
import { resolveStorePath } from '../../store/formStore.js'
import { V_VALIDATIONS } from '../../util/contants.js'
import { collectGetModifierDependencies } from './collectGetDeps.js'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

const runValidationSpecsFromNode = async (
  node: JsonUINode,
  modifiers: ModifierMap,
  ctx: ModifierContext,
  componentStoreName: string | undefined,
  componentLogicalPath: string | undefined
): Promise<void> => {
  const rawValidation = isRecord(node) ? (node[V_VALIDATIONS] as unknown[] | undefined) : undefined

  if (!rawValidation || !Array.isArray(rawValidation) || rawValidation.length === 0) return
  if (!componentStoreName || componentLogicalPath == null) return

  for (const item of rawValidation) {
    if (item === null || typeof item !== 'object') continue
    await runInlineValidation(item, componentStoreName, componentLogicalPath, modifiers, ctx)
  }
}
interface RunRenderNodeResolutionArgs {
  node: JsonUINode
  modifiers: ModifierMap
  ctx: ModifierContext
  currentPath: string
  effectivePathModifiers?: PathModifier
  stylePlatform: StylePlatform
  styleBreakpoint?: BreakpointKey
  /** Store name from the simplified component's own `store` prop, if any. */
  componentStore?: string
  /** Logical path from the simplified component's own `path` prop, if any. */
  componentPath?: string
}

export const runRenderNodeResolution = async ({
  node,
  modifiers,
  ctx,
  currentPath,
  effectivePathModifiers,
  stylePlatform,
  styleBreakpoint,
  componentStore,
  componentPath,
}: RunRenderNodeResolutionArgs): Promise<{
  state: ResolvedRenderNodeState
  deps: StorePathDependency[]
}> => {
  const props: Record<string, unknown> = {}
  const deps: StorePathDependency[] = []
  const resolvedSlots: Record<string, unknown> = {}
  const nodeEntries = isRecord(node) ? Object.entries(node) : []

  for (const [key, value] of nodeEntries) {
    if (key.startsWith('$child') || !key.startsWith('$')) {
      collectGetModifierDependencies(value, currentPath, deps, effectivePathModifiers)
      if (key.startsWith('$child')) {
        resolvedSlots[key] = await resolveModifier(value, modifiers, ctx)
      } else if (!key.startsWith('$')) {
        props[key] = await resolveModifier(value, modifiers, ctx)
      }
    }
  }

  if (props.style != null && typeof props.style === 'object') {
    const resolved = resolveStyle(props.style, {
      platform: stylePlatform,
      breakpoint: styleBreakpoint,
    })
    props.style = resolved ?? props.style
  }

  const resolvedComponentPath =
    componentStore && componentPath != null ? resolveStorePath(componentPath, currentPath, effectivePathModifiers, componentStore) : undefined

  await runValidationSpecsFromNode(node, modifiers, ctx, componentStore, resolvedComponentPath)

  return {
    state: { props, resolvedSlots },
    deps,
  }
}
