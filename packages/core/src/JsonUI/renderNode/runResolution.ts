import type { JsonUINode, ModifierContext, FunctionMap } from '../../types.js'
import { resolveModifier } from '../resolveModifier.js'
import { resolveStyle } from '../../style/resolveStyle.js'
import type { StylePlatform, BreakpointKey } from '../../style/types.js'
import { runInlineValidation } from '../validation.js'
import type { Store } from '../../store.js'
import type { ResolvedRenderNodeState, StorePathDependency } from './resolutionTypes.js'
import { collectGetModifierDependencies } from './collectGetDeps.js'

function runValidationSpecsFromNode(
  node: JsonUINode,
  stores: Record<string, Store>,
  currentPath: string,
  effectivePathModifiers: Record<string, { path: string }> | undefined
): void {
  const rawValidation = (node as Record<string, unknown>).$validation as
    | {
        store?: string
        path?: string
        schema?: unknown
      }
    | {
        store?: string
        path?: string
        schema?: unknown
      }[]
    | undefined

  const specs = Array.isArray(rawValidation) ? rawValidation : rawValidation ? [rawValidation] : []

  for (const spec of specs) {
    if (spec && typeof spec === 'object' && spec.store && typeof spec.store === 'string' && spec.path && typeof spec.path === 'string' && spec.schema) {
      runInlineValidation(
        {
          store: spec.store,
          path: spec.path,
          schema: spec.schema,
        },
        stores,
        currentPath,
        effectivePathModifiers
      )
    }
  }
}

export async function runRenderNodeResolution(args: {
  effectiveNode: JsonUINode
  node: JsonUINode
  functions: FunctionMap
  ctx: ModifierContext
  stores: Record<string, Store>
  currentPath: string
  effectivePathModifiers: Record<string, { path: string }> | undefined
  stylePlatform: StylePlatform
  styleBreakpoint: BreakpointKey | undefined
}): Promise<{
  state: ResolvedRenderNodeState
  deps: StorePathDependency[]
}> {
  const { effectiveNode, node, functions, ctx, stores, currentPath, effectivePathModifiers, stylePlatform, styleBreakpoint } = args

  const props: Record<string, unknown> = {}
  const deps: StorePathDependency[] = []

  for (const [key, value] of Object.entries(effectiveNode)) {
    if (key.startsWith('$')) continue
    collectGetModifierDependencies(value, currentPath, effectivePathModifiers, deps)
    props[key] = await resolveModifier(value, functions, ctx)
  }

  const resolvedSlots: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith('$child')) continue
    collectGetModifierDependencies(value, currentPath, effectivePathModifiers, deps)
    resolvedSlots[key] = await resolveModifier(value, functions, ctx)
  }

  if (props.style != null && typeof props.style === 'object') {
    const resolved = resolveStyle(props.style, {
      platform: stylePlatform,
      breakpoint: styleBreakpoint,
    })
    props.style = resolved ?? props.style
  }

  runValidationSpecsFromNode(node, stores, currentPath, effectivePathModifiers)

  return {
    state: { props, resolvedSlots },
    deps,
  }
}
