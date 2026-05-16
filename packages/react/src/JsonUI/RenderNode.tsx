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

const RenderNodeInner = (props: RenderNodeProps): React.ReactElement | null => {
  const {
    node: origNode,
    components,
    modifiers,
    actions,
    formStore,
    currentPath,
    pathModifiers,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
  } = props

  const node = useMemo(() => expandSimplifiedNode(origNode), [origNode])

  const s = (origNode as Record<string, unknown>).store
  const componentStore = typeof s === 'string' && s.length > 0 ? s : undefined

  const p = (origNode as Record<string, unknown>).path
  const componentPath = typeof p === 'string' ? p : undefined

  const styleConfig = useStyleConfig()
  const ownPathModifiers = getOwnPathModifiers(node)

  const effectivePathModifiers = useMemo(
    () =>
      mergeEffectivePathModifiers({
        ownPathModifiers,
        pathModifiers,
        currentPath,
      }),
    [ownPathModifiers, pathModifiers, currentPath]
  )

  const { resolvedState, resolveError } = useRenderNodeResolution({
    node,
    modifiers,
    formStore,
    currentPath,
    effectivePathModifiers,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
    stylePlatform: styleConfig.platform,
    styleBreakpoint: styleConfig.breakpoint,
    componentStore,
    componentPath,
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

  const infraProps = buildInfraPropsForComponent({
    compName,
    formStore,
    modifiers,
    actions,
    currentPath,
    effectivePathModifiers,
  })

  const { mainChildren, multiChildSlots } = computeRenderNodeSlotChildren({
    node,
    resolvedSlots,
    effectivePathModifiers,
    pathModifiers,
    currentPath,
    formStore,
    components,
    modifiers,
    actions,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
    renderNested,
  })

  const componentActionProps: Record<string, unknown> = {
    ...resolvedProps,
    ...infraProps,
  }

  const eventProps = buildRenderNodeEventProps({
    node,
    modifiers,
    actions,
    formStore,
    currentPath,
    componentProps: componentActionProps,
    effectivePathModifiers,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
  })

  const mergedProps: Record<string, unknown> = {
    ...resolvedProps,
    ...infraProps,
    ...multiChildSlots,
    ...eventProps,
  }

  if (components[compName] === undefined) {
    mergedProps.compName = compName
  }

  applyInputErrorFromValueBinding({
    compName,
    node,
    formStore,
    mergedProps,
  })

  return <Comp {...mergedProps}>{mainChildren}</Comp>
}

const propsAreEqual = (prev: RenderNodeProps, next: RenderNodeProps): boolean => {
  return (
    prev.node === next.node &&
    prev.components === next.components &&
    prev.modifiers === next.modifiers &&
    prev.actions === next.actions &&
    prev.formStore === next.formStore &&
    prev.currentPath === next.currentPath &&
    prev.pathModifiers === next.pathModifiers &&
    prev.validators === next.validators &&
    prev.translations === next.translations &&
    prev.defaultLanguage === next.defaultLanguage &&
    prev.activeLanguage === next.activeLanguage
  )
}

export const RenderNode = React.memo(RenderNodeInner, propsAreEqual)
