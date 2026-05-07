import type { JsonUINode, ModifierContext, ModifierMap, PathModifier, ResolvedRenderNodeState, StorePathDependency, ValidationRule } from '../../util/types.js'
import { resolveModifier } from '../resolveModifier.js'
import { resolveStyle } from '../../style/resolveStyle.js'
import type { StylePlatform, BreakpointKey } from '../../style/types.js'
import { runInlineValidation } from '../validation.js'
import type { Store } from '../../store/store.js'
import { V_VALIDATIONS } from '../../util/contants.js'
import { collectGetModifierDependencies } from './collectGetDeps.js'

function runValidationSpecsFromNode(node: JsonUINode, storeInstance: Store, currentPath: string, effectivePathModifiers?: PathModifier): void {
  const rawValidation = (node as Record<string, unknown>)[V_VALIDATIONS as string] as Partial<ValidationRule | null>[] | undefined

  if (!rawValidation || !Array.isArray(rawValidation) || rawValidation.length === 0) return

  for (const item of rawValidation) {
    if (item === null || typeof item !== 'object') continue
    const s = item
    const store = s.store
    const pathStr = s.path
    const schema = s.schema
    if (typeof store !== 'string' || store.length === 0) continue
    if (typeof pathStr !== 'string' || pathStr.length === 0) continue
    if (schema === undefined || schema === null) continue
    runInlineValidation(
      {
        store,
        path: pathStr,
        schema,
      },
      storeInstance,
      currentPath,
      effectivePathModifiers
    )
  }
}
interface RunRenderNodeResolutionArgs {
  node: JsonUINode
  modifiers: ModifierMap
  ctx: ModifierContext
  store: Store
  currentPath: string
  effectivePathModifiers?: PathModifier
  stylePlatform: StylePlatform
  styleBreakpoint?: BreakpointKey
}

export async function runRenderNodeResolution({
  node,
  modifiers,
  ctx,
  store,
  currentPath,
  effectivePathModifiers,
  stylePlatform,
  styleBreakpoint,
}: RunRenderNodeResolutionArgs): Promise<{
  state: ResolvedRenderNodeState
  deps: StorePathDependency[]
}> {
  const props: Record<string, unknown> = {}
  const deps: StorePathDependency[] = []
  const resolvedSlots: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(node)) {
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

  runValidationSpecsFromNode(node, store, currentPath, effectivePathModifiers)

  return {
    state: { props, resolvedSlots },
    deps,
  }
}
