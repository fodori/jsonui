import type { JsonUINode, ModifierContext, ModifierMap, PathModifier } from '../../util/types.js'
import { resolveModifier } from '../resolveModifier.js'
import { resolveStyle } from '../../style/resolveStyle.js'
import type { StylePlatform, BreakpointKey } from '../../style/types.js'
import { runInlineValidation } from '../validation.js'
import type { Store } from '../../store/store.js'
import type { ResolvedRenderNodeState, StorePathDependency } from './resolutionTypes.js'
import { collectGetModifierDependencies } from './collectGetDeps.js'

function runValidationSpecsFromNode(node: JsonUINode, storeInstance: Store, currentPath: string, effectivePathModifiers?: PathModifier): void {
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
    const raw: unknown = spec
    if (raw === null || typeof raw !== 'object') continue
    const s = raw as Record<string, unknown>
    const store = s.store
    const pathStr = s.path
    const schema = s.schema
    if (typeof store !== 'string' || store.length === 0) continue
    if (typeof pathStr !== 'string' || pathStr.length === 0) continue
    if (schema === undefined) continue
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

export async function runRenderNodeResolution(args: {
  effectiveNode: JsonUINode
  node: JsonUINode
  modifiers: ModifierMap
  ctx: ModifierContext
  store: Store
  currentPath: string
  effectivePathModifiers?: PathModifier
  stylePlatform: StylePlatform
  styleBreakpoint?: BreakpointKey
}): Promise<{
  state: ResolvedRenderNodeState
  deps: StorePathDependency[]
}> {
  const { effectiveNode, node, modifiers, ctx, store, currentPath, effectivePathModifiers, stylePlatform, styleBreakpoint } = args

  const props: Record<string, unknown> = {}
  const deps: StorePathDependency[] = []

  for (const [key, value] of Object.entries(effectiveNode)) {
    if (key.startsWith('$')) continue
    collectGetModifierDependencies(value, currentPath, deps, effectivePathModifiers)
    props[key] = await resolveModifier(value, modifiers, ctx)
  }

  const resolvedSlots: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith('$child')) continue
    collectGetModifierDependencies(value, currentPath, deps, effectivePathModifiers)
    resolvedSlots[key] = await resolveModifier(value, modifiers, ctx)
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
