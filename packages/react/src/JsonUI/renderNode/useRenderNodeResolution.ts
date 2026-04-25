import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import {
  getRootStore,
  runRenderNodeResolution,
  isPathPrefix,
  type JsonUINode,
  type ModifierContext,
  type ModifierMap,
  type Store,
  type TranslationsMap,
  type ValidationRegistry,
  type ResolvedRenderNodeState,
  type StorePathDependency,
  type StylePlatform,
  type BreakpointKey,
} from '@jsonui/core'

export function useRenderNodeResolution(args: {
  effectiveNode: JsonUINode
  node: JsonUINode
  modifiers: ModifierMap
  stores: Record<string, Store>
  currentPath: string
  effectivePathModifiers: Record<string, { path: string }> | undefined
  validators: ValidationRegistry | undefined
  translations: TranslationsMap | undefined
  defaultLanguage: string | undefined
  activeLanguage: string | undefined
  stylePlatform: StylePlatform
  styleBreakpoint: BreakpointKey | undefined
}): {
  resolvedState: ResolvedRenderNodeState | null
  resolveError: Error | null
  dependenciesRef: MutableRefObject<StorePathDependency[]>
  runResolutionRef: MutableRefObject<() => void>
} {
  const {
    effectiveNode,
    node,
    modifiers,
    stores,
    currentPath,
    effectivePathModifiers,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
    stylePlatform,
    styleBreakpoint,
  } = args

  const [resolvedState, setResolvedState] = useState<ResolvedRenderNodeState | null>(null)
  const [resolveError, setResolveError] = useState<Error | null>(null)

  const dependenciesRef = useRef<StorePathDependency[]>([])
  const runResolutionRef = useRef<() => void>(() => {})
  const resolutionVersionRef = useRef(0)

  useEffect(() => {
    const root = getRootStore(stores)
    const unsubscribe =
      typeof root.subscribeChange === 'function'
        ? root.subscribeChange((changedStore, changedPath) => {
            const deps = dependenciesRef.current
            for (const dep of deps) {
              if (dep.store !== changedStore) continue
              if (isPathPrefix(dep.path, changedPath) || isPathPrefix(changedPath, dep.path)) {
                runResolutionRef.current()
                break
              }
            }
          })
        : undefined
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [stores])

  /* eslint-disable react-hooks/exhaustive-deps -- legacy JsonUI resolution deps */
  useEffect(() => {
    let cancelled = false
    setResolveError(null)
    const version = ++resolutionVersionRef.current

    const ctx: ModifierContext = {
      stores,
      currentPath,
      pathModifiers: effectivePathModifiers,
      validators,
      translations,
      defaultLanguage,
      activeLanguage,
    }

    const run = async () => {
      try {
        const { state, deps } = await runRenderNodeResolution({
          effectiveNode,
          node,
          modifiers,
          ctx,
          stores,
          currentPath,
          effectivePathModifiers,
          stylePlatform,
          styleBreakpoint,
        })

        if (!cancelled && resolutionVersionRef.current === version) {
          setResolvedState(state)
          dependenciesRef.current = deps
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        if (!cancelled && resolutionVersionRef.current === version) {
          setResolveError(error)
          setResolvedState({
            props: {},
            resolvedSlots: {},
          })
        }
      }
    }

    runResolutionRef.current = () => {
      void run()
    }
    void run()

    return () => {
      cancelled = true
    }
  }, [effectiveNode, modifiers, stores, currentPath, effectivePathModifiers, stylePlatform, styleBreakpoint])
  /* eslint-enable react-hooks/exhaustive-deps */

  return {
    resolvedState,
    resolveError,
    dependenciesRef,
    runResolutionRef,
  }
}
