import React, { useEffect, useMemo, useRef } from 'react'
import type {
  JsonUINode,
  JsonUIValue,
  FunctionMap,
  TranslationsMap,
  OnStateExportType,
  JSONObject,
  StylePlatform,
  ValidationRegistry,
  ValidationRule,
} from '@jsonui/core'
import { buildValidationRegistry, Store, getRootStore, V_COMP, V_CHILDREN } from '@jsonui/core'
import type { ComponentMap } from '../componentMap.js'
import { useStores } from '../hooks/useStores.js'
import { builtinComponents } from '../components/index.js'
import { RenderNode } from './RenderNode.js'
import { StyleProvider } from '../style/StyleContext.js'
import { MessageReceiver } from './MessageReceiver.js'

function normalizeRootModel(model: JsonUIValue | undefined): JsonUINode {
  if (model === undefined || model === null) {
    return { [V_COMP]: 'Fragment' }
  }
  if (Array.isArray(model)) {
    return { [V_COMP]: 'Fragment', [V_CHILDREN]: model }
  }
  const t = typeof model
  if (t === 'string' || t === 'number' || t === 'boolean' || t === 'bigint') {
    return { [V_COMP]: 'Fragment', [V_CHILDREN]: model }
  }
  if (t === 'symbol') {
    return { [V_COMP]: 'Fragment' }
  }
  return model as JsonUINode
}

function modelTopRecord(model: JsonUIValue | undefined): Record<string, unknown> | undefined {
  if (model === null || model === undefined) return undefined
  if (typeof model !== 'object' || Array.isArray(model)) return undefined
  return model
}

export interface JsonUIProps {
  /** Root UI definition, or any JSON value (wrapped in a root `Fragment` when not a plain object node). */
  model: JsonUIValue
  components?: ComponentMap
  /** Handlers for both `$action` and `$modifier` in the model. */
  functions?: FunctionMap
  // Single root store instance (optional)
  stores?: Store
  // defaultValues: Record<storeName, JSON>
  defaultValues?: Record<string, JSONObject>
  id?: string
  /** Called on unmount and when model/defaultValues/id change (main JsonUI parity). */
  onStateExport?: OnStateExportType
  // Baseline language of keys (used by $modifier: "t"), defaults to "en".
  defaultLanguage?: string
  // Active UI language (used by $modifier: "t"), e.g. "en", "hu".
  activeLanguage?: string
  /** Platform for style resolution: "web" (default) or "native" (React Native). */
  platform?: StylePlatform
}

export function JsonUI({
  model,
  components = {},
  functions = {},
  stores: initialStores,
  defaultValues = {},
  defaultLanguage = 'en',
  activeLanguage,
  platform = 'web',
  id,
  onStateExport,
}: JsonUIProps): React.ReactElement | null {
  const stores = useStores(initialStores, defaultValues)
  const top = modelTopRecord(model)
  const validationRegistry: ValidationRegistry = useMemo(
    () => buildValidationRegistry((top?.$validations as ValidationRule[] | undefined) ?? []),
    [top]
  )
  const allComponents = useMemo(() => (Object.keys(components).length ? components : builtinComponents), [components])

  const resolvedLanguage = activeLanguage ?? defaultLanguage

  // could we move the translation into a functions?
  const translations: TranslationsMap = useMemo(() => {
    const raw = top?.$translate
    if (!raw || typeof raw !== 'object') return {}

    const map: TranslationsMap = {}

    // New shape: { langCode: { key: value, ... }, ... }
    for (const [lang, table] of Object.entries(raw as Record<string, unknown>)) {
      if (!table || typeof table !== 'object') continue
      for (const [key, val] of Object.entries(table as Record<string, unknown>)) {
        if (typeof val !== 'string' || !key) continue
        const entry = (map[key] ??= {})
        entry[lang] = val
      }
    }

    return map
  }, [top])

  const idRef = useRef(id)
  useEffect(() => {
    idRef.current = id
  }, [id])

  useEffect(() => {
    return () => {
      if (onStateExport) {
        const root = getRootStore(stores)
        onStateExport({
          id: idRef.current,
          formState: root.getLogicalStoresMap(),
        })
      }
    }
  }, [model, defaultValues, onStateExport, id, stores])

  const rootNode = useMemo(() => normalizeRootModel(model), [model])

  return (
    // TODO: the style looks like strict, how can I use extra styles? need to test.
    <StyleProvider platform={platform}>
      <MessageReceiver stores={stores} />
      <RenderNode
        node={rootNode}
        components={allComponents}
        functions={functions}
        stores={stores}
        validators={validationRegistry}
        translations={translations}
        defaultLanguage={defaultLanguage}
        activeLanguage={resolvedLanguage}
        currentPath="/"
        pathModifiers={undefined}
      />
    </StyleProvider>
  )
}
