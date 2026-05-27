import React, { useCallback, useMemo } from 'react'
import { expandSimplifiedNode, getOwnPathModifiers, JsonUINode, mergeEffectivePathModifiers, V_COMP } from '@jsonui/core'
import { useStyleConfig } from '../style/StyleContext.js'
import type { RenderNodeProps } from './renderNode/types.js'
export type { RenderNodeProps } from './renderNode/types.js'
import { useRenderNodeResolution } from './renderNode/useRenderNodeResolution.js'
import { buildRenderNodeEventProps } from './renderNode/buildEventProps.js'
import { buildComponentContext, resolveExplicitFieldErrors } from './renderNode/buildInfraAndInputProps.js'
import { computeRenderNodeSlotChildren } from './renderNode/computeSlotChildren.js'
import { builtinComponents } from '../components/index.js'

const sanitizePathModifiers = (value: unknown): Record<string, { path: string }> | undefined => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined

  const sanitized: Record<string, { path: string }> = {}
  for (const [storeName, spec] of Object.entries(value)) {
    if (!spec || typeof spec !== 'object' || Array.isArray(spec)) continue
    const rawPath = (spec as { path?: unknown }).path
    if (typeof rawPath !== 'string' || rawPath.length === 0) continue
    sanitized[storeName] = { path: rawPath }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined
}

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

  const s = origNode.store
  const componentStore = typeof s === 'string' && s.length > 0 ? s : undefined

  const p = origNode.path
  const componentPath = typeof p === 'string' ? p : undefined

  const styleConfig = useStyleConfig()
  const ownPathModifiers = useMemo(() => sanitizePathModifiers(getOwnPathModifiers(node)), [node])

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

  if (typeof origNode !== 'object') {
    return null
  }
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

  const fallbackUndefined = components._Undefined ?? (builtinComponents as Record<string, React.ComponentType<any>>)._Undefined
  const Comp = components[compName] ?? fallbackUndefined

  // Extract context-specific props from resolvedProps so they don't bleed into HTML attrs
  const {
    fieldErrors: resolvedFieldErrors,
    fieldTouched,
    ...$ownResolvedProps
  } = resolvedProps as Record<string, unknown> & {
    fieldErrors?: unknown
    fieldTouched?: unknown
  }

  // For the explicit binding case (value: { $modifier: 'get', ... }) resolve errors from store
  const explicitFieldErrors = resolveExplicitFieldErrors({ node, formStore })

  const $ctx = buildComponentContext({
    formStore,
    modifiers,
    actions,
    currentPath,
    effectivePathModifiers,
    fieldErrors: resolvedFieldErrors ?? explicitFieldErrors,
    fieldTouched,
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

  // Keep flat resolvedProps (with fieldErrors/fieldTouched) for action context so
  // action handlers that read componentProps still receive these values.
  const componentActionProps: JsonUINode = {
    ...resolvedProps,
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

  const mergedProps: JsonUINode = {
    ...$ownResolvedProps,
    $ctx,
    ...multiChildSlots,
    ...eventProps,
  }

  if (mergedProps.style != null && (typeof mergedProps.style !== 'object' || Array.isArray(mergedProps.style))) {
    delete mergedProps.style
  }

  if (components[compName] === undefined) {
    mergedProps.compName = compName
  }

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
