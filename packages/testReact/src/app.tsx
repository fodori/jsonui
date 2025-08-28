import React, { useRef, useState } from 'react'

import JsonUI, { JSONValue } from '@jsonui/react'

const forms = {
  form1: {
    $comp: 'Edit',
    value: { $modifier: 'get', store: 'data', path: 'firstname' },
    label: 'Form 1',
    onChange: {
      $action: 'set',
      store: 'data',
      path: 'firstname',
    },
  },
  form2: [
    {
      $comp: 'Edit',
      value: { $modifier: 'get', store: 'data', path: 'firstname' },
      label: 'Form 2',
      onChange: {
        $action: 'set',
        store: 'data',
        path: 'firstname',
      },
      style: {
        border: '3px solid green',
        '@media (min-width: 420px)': {
          border: '3px solid red',
        },
      },
    },
    {
      $comp: 'Edit',
      value: { $modifier: 'get', store: 'data', path: 'firstname', jsonataDef: "$ ? $uppercase($): 'empty'" },
      label: 'Full uppercase',
      disabled: true,
    },
  ],
  form3: {
    $comp: 'Edit',
    value: { $modifier: 'get', store: 'data', path: 'firstname' },
    label: 'Form 3',
    onChange: {
      $action: 'set',
      store: 'data',
      path: 'firstname',
    },
  },
}

type Keys = 'form1' | 'form2' | 'form3'

const App = () => {
  const [actualKey, setActualKey] = useState<Keys>('form1')

  const [defaultValues, setDefaultValues] = useState<Record<Keys, JSONValue | undefined>>({
    form1: undefined,
    form2: undefined,
    form3: undefined,
  })

  const getFormState = useRef<(() => any) | undefined>(undefined)

  const getActualDefaultValue = () => {
    if (getFormState.current) {
      return getFormState.current()
    }
    return undefined
  }

  const formSwitch = (key: Keys) => () => {
    const defaultValue = getActualDefaultValue()
    setDefaultValues({ ...defaultValues, [actualKey]: defaultValue })
    setActualKey(key)
  }
  const model = forms[`${actualKey}`]
  const defaultValue = defaultValues[`${actualKey}`] || {
    data: {
      firstname: '',
    },
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
      <button type="button" onClick={() => console.log('actualValue: ', getActualDefaultValue())}>
        Console log actual state
      </button>
      <JsonUI model={model as any} getFormState={getFormState} defaultValues={defaultValue as any} />
    </div>
  )
}

export default App
