import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { JsonUI, builtinComponents } from '@jsonui/react'
import { functions, type JSONObject } from '@jsonui/core'
import forms from './forms.json' with { type: 'json' }

type Keys = 'form1' | 'form2' | 'form3'

/** Stable empty tree when no Redux snapshot exists yet. */
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

const FormViewer = () => {
  const [actualKey, setActualKey] = useState<Keys>('form1')
  const savedLogicalStores = useSelector((state: unknown) => (state as Record<string, unknown>)[actualKey])
  const dispatch = useDispatch()

  const formSwitch = (key: Keys) => () => {
    setActualKey(key)
  }

  const model = (forms as Record<string, unknown>)[`${actualKey}`]

  const defaultValues = useMemo(() => savedSnapshotToDefaultValues(savedLogicalStores), [savedLogicalStores])

  const onStateExport = useCallback(
    ({ id, formState }: { id?: string; formState: unknown }) => {
      console.log('formState', formState)
      dispatch({
        type: 'SAVE_FORM',
        payload: {
          id,
          defaultValue: JSON.parse(JSON.stringify(formState)) as unknown,
        },
      })
    },
    [dispatch]
  )

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
      <JsonUI
        key={actualKey}
        model={model as never}
        onStateExport={onStateExport}
        defaultValues={defaultValues}
        id={actualKey}
        components={builtinComponents}
        functions={functions}
      />
    </div>
  )
}

export default FormViewer
