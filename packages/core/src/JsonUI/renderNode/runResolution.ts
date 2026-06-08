import type { JSONParams, JsonUINode, ModifierContext, ModifierMap, PathModifier, ResolvedRenderNodeState, StorePathDependency , InlineValidationSpec } from '../../util/types.js'
import { resolveModifier } from '../resolveModifier.js'
import { resolveStyle } from '../../style/resolveStyle.js'
import type { StylePlatform, BreakpointKey } from '../../style/types.js'
import { runInlineValidations } from '../validation.js'
import { resolveStorePath } from '../../store/formStore.js'
import { V_VALIDATIONS } from '../../util/contants.js'
import { collectGetModifierDependencies } from './collectGetDeps.js'

const isRecord = (value: unknown): value is JSONParams => {
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

  const specs = rawValidation.filter((item): item is InlineValidationSpec => item !== null && typeof item === 'object')
  if (specs.length === 0) return

  // Silent write: fieldErrors are resolved in the same pass right after validation.
  await runInlineValidations(specs, componentStoreName, componentLogicalPath, modifiers, ctx, { notify: false })
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
  /** When true, skip inline validation (e.g. re-resolve after error/touch store updates). */
  skipInlineValidation?: boolean
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
  skipInlineValidation = false,
}: RunRenderNodeResolutionArgs): Promise<{
  state: ResolvedRenderNodeState
  deps: StorePathDependency[]
}> => {
  const props: JSONParams = {}
  const deps: StorePathDependency[] = []
  const resolvedSlots: JSONParams = {}
  const nodeEntries = isRecord(node) ? Object.entries(node) : []

  const resolvedComponentPath =
    componentStore && componentPath != null ? resolveStorePath(componentPath, currentPath, effectivePathModifiers, componentStore) : undefined

  if (!skipInlineValidation) {
    await runValidationSpecsFromNode(node, modifiers, ctx, componentStore, resolvedComponentPath)
  }

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

  if (props.style != null) {
    if (typeof props.style !== 'object' || Array.isArray(props.style)) {
      delete props.style
    } else {
      const resolved = resolveStyle(props.style, {
        platform: stylePlatform,
        breakpoint: styleBreakpoint,
      })
      props.style = resolved ?? props.style
    }
  }

  return {
    state: { props, resolvedSlots },
    deps,
  }
}
