import { useEffect, useRef, useState, type RefObject } from 'react'
import {
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

interface UseRenderNodeResolutionArgs {
  node: JsonUINode
  modifiers: ModifierMap
  store: Store
  currentPath: string
  effectivePathModifiers?: ModifierContext['pathModifiers']
  validators: ValidationRegistry | undefined
  translations: TranslationsMap | undefined
  defaultLanguage: string | undefined
  activeLanguage: string | undefined
  stylePlatform: StylePlatform
  styleBreakpoint?: BreakpointKey
  /** Store name from the simplified component's own `store` prop, if any. */
  componentStore?: string
  /** Path from the simplified component's own `path` prop, if any. */
  componentPath?: string
}
interface UseRenderNodeResolutionResult {
  resolvedState: ResolvedRenderNodeState | null
  resolveError: Error | null
  dependenciesRef: RefObject<StorePathDependency[]>
  runResolutionRef: RefObject<() => void>
}

export const useRenderNodeResolution = ({
  node,
  modifiers,
  store,
  currentPath,
  effectivePathModifiers,
  validators,
  translations,
  defaultLanguage,
  activeLanguage,
  stylePlatform,
  styleBreakpoint,
  componentStore,
  componentPath,
}: UseRenderNodeResolutionArgs): UseRenderNodeResolutionResult => {
  const [resolvedState, setResolvedState] = useState<ResolvedRenderNodeState | null>(null)
  const [resolveError, setResolveError] = useState<Error | null>(null)

  const dependenciesRef = useRef<StorePathDependency[]>([])
  const runResolutionRef = useRef<() => void>(() => {})
  const resolutionVersionRef = useRef(0)

  useEffect(() => {
    const unsubscribe =
      typeof store.subscribeChange === 'function'
        ? store.subscribeChange((changedStore, changedPath) => {
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
  }, [store])

  /* eslint-disable react-hooks/exhaustive-deps -- legacy JsonUI resolution deps */
  useEffect(() => {
    let cancelled = false
    setResolveError(null)
    const version = ++resolutionVersionRef.current

    const ctx: ModifierContext = {
      store,
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
          node,
          modifiers,
          ctx,
          store,
          currentPath,
          effectivePathModifiers,
          stylePlatform,
          styleBreakpoint,
          componentStore,
          componentPath,
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
  }, [node, modifiers, store, currentPath, effectivePathModifiers, stylePlatform, styleBreakpoint, componentStore, componentPath])
  /* eslint-enable react-hooks/exhaustive-deps */

  return {
    resolvedState,
    resolveError,
    dependenciesRef,
    runResolutionRef,
  }
}
