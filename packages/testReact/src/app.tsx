import { useCallback, useMemo, useRef, useState } from 'react'
import { JSONObject, JsonUI, JsonUINode, OnStateExportProps, actions, builtinComponents, modifiers } from '@jsonui/react'
import forms from './forms.json' with { type: 'json' }

type Keys = 'form1' | 'form2' | 'form3'

const EMPTY_DEFAULT_VALUES: Record<string, JSONObject> = {
  data: { firstname: '' },
}

function savedSnapshotToDefaultValues(saved: unknown): Record<string, JSONObject> {
  if (saved === null || typeof saved !== 'object' || Array.isArray(saved)) {
    return EMPTY_DEFAULT_VALUES
  }
  const cloned = JSON.parse(JSON.stringify(saved)) as Record<string, JSONObject>
  return Object.keys(cloned).length > 0 ? cloned : EMPTY_DEFAULT_VALUES
}

const App = () => {
  const [actualKey, setActualKey] = useState<Keys>('form1')
  const [savedByForm, setSavedByForm] = useState<Record<Keys, unknown>>({
    form1: undefined,
    form2: undefined,
    form3: undefined,
  })
  const lastExportRef = useRef<unknown>(undefined)

  const formSwitch = (key: Keys) => () => {
    setActualKey(key)
  }

  const model = (forms as Record<Keys, JsonUINode>)[actualKey]

  const defaultValues = useMemo(() => savedSnapshotToDefaultValues(savedByForm[actualKey]), [savedByForm, actualKey])

  const onStateExport = useCallback(({ id, formState }: OnStateExportProps) => {
    lastExportRef.current = formState
    if (id !== 'form1' && id !== 'form2' && id !== 'form3') return
    const key = id
    const next = JSON.parse(JSON.stringify(formState)) as unknown
    setSavedByForm((prev) => {
      // Avoid setState when unchanged: JsonUI re-runs this export whenever `defaultValues`
      // / `stores` change; feeding a new snapshot back recreates the store and retriggers export (infinite loop).
      if (JSON.stringify(prev[key]) === JSON.stringify(next)) {
        return prev
      }
      return { ...prev, [key]: next }
    })
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'space-around', gap: 10 }}>
      <button type="button" onClick={formSwitch('form1')}>
        Switch to Form1
      </button>
      <button type="button" onClick={formSwitch('form2')}>
        Switch to Form2
      </button>
      <button type="button" onClick={formSwitch('form3')}>
        Switch to Form3
      </button>
      <button type="button" onClick={() => console.log('last exported formState:', lastExportRef.current)}>
        Console log actual state
      </button>
      <JsonUI
        key={actualKey}
        id={actualKey}
        model={model}
        onStateExport={onStateExport}
        defaultValues={defaultValues}
        components={builtinComponents}
        modifiers={modifiers}
        actions={actions}
      />
    </div>
  )
}

export default App
