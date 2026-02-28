import React, { useState } from 'react'
import { JsonUI } from '../../index'
import forms from './forms.json'
import { useDispatch, useSelector } from 'react-redux'

type Keys = 'form1' | 'form2' | 'form3'

const FormViewer = () => {
  const [actualKey, setActualKey] = useState<Keys>('form1')
  const defaultValueState: any = useSelector((state) => (state as any)?.[actualKey])
  const dispatch = useDispatch()

  const formSwitch = (key: Keys) => () => {
    setActualKey(key)
  }

  const defaultValues: any = []
  const model = forms[`${actualKey}`]
  const defaultValue = defaultValueState || {
    data: {
      firstname: '',
    },
  }
  const onStateExport = ({ id, defaultValue }: any) => {
    dispatch({
      type: 'SAVE_FORM',
      payload: {
        id,
        defaultValue,
      },
    })
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'space-around', gap: 10 }}>
      <button type="button" onClick={formSwitch('form1')}>
        Switch to From1
      </button>
      <button type="button" onClick={formSwitch('form2')}>
        Switch to Form2
      </button>
      <button type="button" onClick={formSwitch('form3')}>
        Switch to Form3
      </button>
      <button type="button" onClick={() => console.log('actualValue: ', defaultValueState)}>
        Console log actual state
      </button>
      <JsonUI model={model} onStateExport={onStateExport} defaultValues={defaultValue as any} id={actualKey} />
    </div>
  )
}

export default FormViewer
