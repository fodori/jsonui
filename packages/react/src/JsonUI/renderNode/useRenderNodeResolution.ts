import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  runRenderNodeResolution,
  isPathPrefix,
  ERROR_STORE_SUFFIX,
  TOUCH_STORE_SUFFIX,
  type JsonUINode,
  type ModifierContext,
  type ModifierMap,
  type FormStore,
  type TranslationsMap,
  type ValidationRegistry,
  type ResolvedRenderNodeState,
  type StorePathDependency,
  type StylePlatform,
  type BreakpointKey,
} from '@jsonui/core'

const isShadowStore = (storeName: string): boolean =>
  storeName.endsWith(ERROR_STORE_SUFFIX) || storeName.endsWith(TOUCH_STORE_SUFFIX)

interface UseRenderNodeResolutionArgs {
  node: JsonUINode
  modifiers: ModifierMap
  formStore: FormStore
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
  runResolutionRef: RefObject<(options?: { skipInlineValidation?: boolean }) => void>
}

export const useRenderNodeResolution = ({
  node,
  modifiers,
  formStore,
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
  const runResolutionRef = useRef<(options?: { skipInlineValidation?: boolean }) => void>(() => {})
  const resolutionVersionRef = useRef(0)

  useEffect(() => {
    const unsubscribe =
      typeof formStore.subscribeChange === 'function'
        ? formStore.subscribeChange((changedStore, changedPath) => {
            const deps = dependenciesRef.current
            for (const dep of deps) {
              if (dep.store !== changedStore) continue
              if (isPathPrefix(dep.path, changedPath) || isPathPrefix(changedPath, dep.path)) {
                runResolutionRef.current({ skipInlineValidation: isShadowStore(changedStore) })
                break
              }
            }
          })
        : undefined
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [formStore])

  /* eslint-disable react-hooks/exhaustive-deps -- legacy JsonUI resolution deps */
  useEffect(() => {
    let cancelled = false
    setResolveError(null)

    const ctx: ModifierContext = {
      formStore,
      currentPath,
      pathModifiers: effectivePathModifiers,
      validators,
      translations,
      defaultLanguage,
      activeLanguage,
    }

    const run = async (version: number, skipInlineValidation = false) => {
      try {
        const { state, deps } = await runRenderNodeResolution({
          node,
          modifiers,
          ctx,
          currentPath,
          effectivePathModifiers,
          stylePlatform,
          styleBreakpoint,
          componentStore,
          componentPath,
          skipInlineValidation,
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

    runResolutionRef.current = (options) => {
      const version = ++resolutionVersionRef.current
      void run(version, options?.skipInlineValidation)
    }

    const version = ++resolutionVersionRef.current
    void run(version, false)

    return () => {
      cancelled = true
    }
  }, [node, modifiers, formStore, currentPath, effectivePathModifiers, stylePlatform, styleBreakpoint, componentStore, componentPath])
  /* eslint-enable react-hooks/exhaustive-deps */

  return {
    resolvedState,
    resolveError,
    dependenciesRef,
    runResolutionRef,
  }
}
