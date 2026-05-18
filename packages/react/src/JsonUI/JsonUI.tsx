import React, { useEffect, useMemo, useRef } from 'react'
import type {
  JsonUINode,
  ActionMap,
  ModifierMap,
  TranslationsMap,
  OnStateExportType,
  JSONObject,
  FormStore,
  StylePlatform,
  ValidationRegistry,
  ValidationRule,
} from '@jsonui/core'
import { buildValidationRegistry, V_VALIDATIONS } from '@jsonui/core'
import type { ComponentMap } from '../componentMap.js'
import { useFormStore } from '../hooks/useFormStores.js'
import { builtinComponents } from '../components/index.js'
import { RenderNode } from './RenderNode.js'
import { StyleProvider } from '../style/StyleContext.js'
import { MessageReceiver } from './MessageReceiver.js'
import { isRecord } from '../utils/isRecord.js'

export interface JsonUIProps {
  model: JsonUINode
  components?: ComponentMap
  /** Handlers for `$modifier` in the model. */
  modifiers?: ModifierMap
  /** Handlers for `$action` in the model. */
  actions?: ActionMap
  // Single root store instance (optional)
  initialFormStore?: FormStore
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
  initialFormStore,
  defaultValues = {},
  defaultLanguage = 'en',
  activeLanguage,
  platform = 'web',
  id,
  onStateExport,
}: JsonUIProps): React.ReactElement | null => {
  const modelRecord = isRecord(model) ? model : undefined

  const formStore: FormStore = useFormStore(initialFormStore, defaultValues)
  const validationRegistry: ValidationRegistry = useMemo(() => {
    const validations = modelRecord?.[V_VALIDATIONS] as ValidationRule[] | undefined
    return buildValidationRegistry(validations ?? [])
  }, [modelRecord])

  const allComponents = useMemo(() => {
    if (!isRecord(components)) return builtinComponents
    return Object.keys(components).length > 0 ? { ...builtinComponents, ...components } : builtinComponents
  }, [components])

  const resolvedLanguage = activeLanguage ?? defaultLanguage

  // could we move the translation into a modifier?
  const translations: TranslationsMap = useMemo(() => {
    const raw = modelRecord?.$translate
    if (!isRecord(raw)) return {}

    const map: TranslationsMap = {}

    // New shape: { langCode: { key: value, ... }, ... }
    for (const [lang, table] of Object.entries(raw)) {
      if (!isRecord(table)) continue
      for (const [key, val] of Object.entries(table)) {
        if (typeof val !== 'string' || !key) continue
        const entry = (map[key] ??= {})
        entry[lang] = val
      }
    }

    return map
  }, [modelRecord])

  const idRef = useRef(id)
  useEffect(() => {
    idRef.current = id
  }, [id])

  useEffect(() => {
    return () => {
      if (onStateExport) {
        onStateExport({
          id: idRef.current,
          formState: formStore.getLogicalStoresMap(),
        })
      }
    }
  }, [model, defaultValues, onStateExport, id, formStore])

  // TODO: the model could be something else, like array, number, string, boolean, etc.
  const modelUnknown: unknown = model
  if (modelUnknown === null || typeof modelUnknown !== 'object') {
    return <div style={{ padding: 16, color: '#666' }}>JsonUI: no valid model</div>
  }

  return (
    // TODO: the style looks like strict, how can I use extra styles? need to test.
    <StyleProvider platform={platform}>
      <MessageReceiver formStore={formStore} />
      <RenderNode
        node={model}
        components={allComponents}
        modifiers={modifiers}
        actions={actions}
        formStore={formStore}
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
