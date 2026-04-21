import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { JsonUI, builtinComponents } from '@jsonui/react'
import { functions } from '@jsonui/core'
import forms from './forms.json' with { type: 'json' }

type Keys = 'form1' | 'form2' | 'form3'

const FormViewer = () => {
  const [actualKey, setActualKey] = useState<Keys>('form1')
  const defaultValueState = useSelector((state: unknown) => (state as Record<string, unknown>)[actualKey])
  const dispatch = useDispatch()

  const formSwitch = (key: Keys) => () => {
    setActualKey(key)
  }

  const model = (forms as Record<string, unknown>)[`${actualKey}`]
  const defaultValue = defaultValueState || {
    data: {
      firstname: '',
    },
  }
  const onStateExport = ({ id, formState }: { id?: string; formState: unknown }) => {
    dispatch({
      type: 'SAVE_FORM',
      payload: {
        id,
        defaultValue: formState,
      },
    })
  }
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
        model={model as never}
        onStateExport={onStateExport}
        defaultValues={defaultValue as never}
        id={actualKey}
        components={builtinComponents}
        functions={functions}
      />
    </div>
  )
}

export default FormViewer
