import React, { useCallback, useMemo } from 'react'
import { expandSimplifiedNode, getOwnPathModifiers, mergeEffectivePathModifiers, V_COMP } from '@jsonui/core'
import { useStyleConfig } from '../style/StyleContext.js'
import type { RenderNodeProps } from './renderNode/types.js'
export type { RenderNodeProps } from './renderNode/types.js'
import { useRenderNodeResolution } from './renderNode/useRenderNodeResolution.js'
import { buildRenderNodeEventProps } from './renderNode/buildEventProps.js'
import { buildInfraPropsForComponent, applyInputErrorFromValueBinding } from './renderNode/buildInfraAndInputProps.js'
import { computeRenderNodeSlotChildren } from './renderNode/computeSlotChildren.js'
import { builtinComponents } from '../components/index.js'

function RenderNodeInner(props: RenderNodeProps): React.ReactElement | null {
  const { node, components, functions, stores, currentPath, pathModifiers, validators, translations, defaultLanguage, activeLanguage } = props

  const styleConfig = useStyleConfig()
  const ownPathModifiers = getOwnPathModifiers(node)

  const effectivePathModifiers = useMemo(
    () => mergeEffectivePathModifiers(ownPathModifiers, pathModifiers, currentPath),
    [ownPathModifiers, pathModifiers, currentPath]
  )

  const effectiveNode = useMemo(() => expandSimplifiedNode(node), [node])

  const { resolvedState, resolveError } = useRenderNodeResolution({
    effectiveNode,
    node,
    functions,
    stores,
    currentPath,
    effectivePathModifiers,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
    stylePlatform: styleConfig.platform,
    styleBreakpoint: styleConfig.breakpoint,
  })

  const renderNested = useCallback((p: RenderNodeProps) => <RenderNode {...p} />, [])

  if (resolveError) {
    console.error('[JsonUI] resolveModifier error:', resolveError)
    return <div style={{ padding: 8, color: '#c00', fontSize: 12 }}>Error: {resolveError.message}</div>
  }

  if (resolvedState === null) {
    return null
  }

  const { props: resolvedProps, resolvedSlots } = resolvedState
  const compName = node[V_COMP]
  if (!compName) return null

  const fallbackUndefined = components._Undefined ?? (builtinComponents as Record<string, React.ComponentType<unknown>>)._Undefined
  const Comp = components[compName] ?? fallbackUndefined

  const eventProps = buildRenderNodeEventProps({
    effectiveNode,
    functions,
    stores,
    currentPath,
    effectivePathModifiers,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
  })

  const infraProps = buildInfraPropsForComponent({
    compName,
    stores,
    functions,
    currentPath,
    effectivePathModifiers,
  })

  const { mainChildren, multiChildSlots } = computeRenderNodeSlotChildren({
    node,
    resolvedSlots,
    effectivePathModifiers,
    pathModifiers,
    currentPath,
    stores,
    components,
    functions,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
    renderNested,
  })

  const mergedProps: Record<string, unknown> = {
    ...resolvedProps,
    ...eventProps,
    ...infraProps,
    ...multiChildSlots,
  }

  if (components[compName] === undefined) {
    mergedProps.compName = compName
  }

  applyInputErrorFromValueBinding({
    compName,
    effectiveNode,
    stores,
    mergedProps,
  })

  return <Comp {...mergedProps}>{mainChildren}</Comp>
}

function propsAreEqual(prev: RenderNodeProps, next: RenderNodeProps): boolean {
  return (
    prev.node === next.node &&
    prev.components === next.components &&
    prev.functions === next.functions &&
    prev.stores === next.stores &&
    prev.currentPath === next.currentPath &&
    prev.pathModifiers === next.pathModifiers &&
    prev.validators === next.validators &&
    prev.translations === next.translations &&
    prev.defaultLanguage === next.defaultLanguage &&
    prev.activeLanguage === next.activeLanguage
  )
}

export const RenderNode = React.memo(RenderNodeInner, propsAreEqual)
