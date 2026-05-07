import React, { useEffect, useMemo, useRef } from 'react'
import type {
  JsonUINode,
  ActionMap,
  ModifierMap,
  TranslationsMap,
  OnStateExportType,
  JSONObject,
  StylePlatform,
  ValidationRegistry,
  ValidationRule,
} from '@jsonui/core'
import { buildValidationRegistry, Store, V_VALIDATIONS } from '@jsonui/core'
import type { ComponentMap } from '../componentMap.js'
import { useStore } from '../hooks/useStores.js'
import { builtinComponents } from '../components/index.js'
import { RenderNode } from './RenderNode.js'
import { StyleProvider } from '../style/StyleContext.js'
import { MessageReceiver } from './MessageReceiver.js'

export interface JsonUIProps {
  model: JsonUINode
  components?: ComponentMap
  /** Handlers for `$modifier` in the model. */
  modifiers?: ModifierMap
  /** Handlers for `$action` in the model. */
  actions?: ActionMap
  // Single root store instance (optional)
  store?: Store
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

export const JsonUI = ({
  model,
  components = {},
  modifiers = {},
  actions = {},
  store: initialStore,
  defaultValues = {},
  defaultLanguage = 'en',
  activeLanguage,
  platform = 'web',
  id,
  onStateExport,
}: JsonUIProps): React.ReactElement | null => {
  const store: Store = useStore(initialStore, defaultValues)
  const validationRegistry: ValidationRegistry = useMemo(() => {
    const validations = (model as unknown as Record<string, unknown>)[V_VALIDATIONS] as ValidationRule[] | undefined
    return buildValidationRegistry(validations ?? [])
  }, [model])
  const allComponents = useMemo(() => (Object.keys(components).length > 0 ? { ...builtinComponents, ...components } : builtinComponents), [components])

  const resolvedLanguage = activeLanguage ?? defaultLanguage

  // could we move the translation into a modifier?
  const translations: TranslationsMap = useMemo(() => {
    const raw = (model as unknown as { $translate?: unknown }).$translate
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
  }, [model])

  const idRef = useRef(id)
  useEffect(() => {
    idRef.current = id
  }, [id])

  useEffect(() => {
    return () => {
      if (onStateExport) {
        onStateExport({
          id: idRef.current,
          formState: store.getLogicalStoresMap(),
        })
      }
    }
  }, [model, defaultValues, onStateExport, id, store])

  // TODO: the model could be something else, like array, number, string, boolean, etc.
  const modelUnknown: unknown = model
  if (modelUnknown === null || typeof modelUnknown !== 'object') {
    return <div style={{ padding: 16, color: '#666' }}>JsonUI: no valid model</div>
  }

  return (
    // TODO: the style looks like strict, how can I use extra styles? need to test.
    <StyleProvider platform={platform}>
      <MessageReceiver store={store} />
      <RenderNode
        node={model}
        components={allComponents}
        modifiers={modifiers}
        actions={actions}
        store={store}
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
