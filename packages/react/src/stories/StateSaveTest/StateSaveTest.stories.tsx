import React, { useRef, useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { DefaultValues, JSONValue } from 'types'
import { JsonUI } from '../../index'

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
  form2: {
    $comp: 'Edit',
    value: { $modifier: 'get', store: 'data', path: 'firstname' },
    label: 'Form 2',
    onChange: {
      $action: 'set',
      store: 'data',
      path: 'firstname',
    },
  },
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

const JsonUIStory = {
  title: 'Store State Test',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

type Keys = 'form1' | 'form2' | 'form3'

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof JsonUI> = (args) => {
  const [actualKey, setActualKey] = useState<Keys>('form1')

  const [defaultValues, setDefaultValues] = useState<Record<Keys, JSONValue | undefined>>({
    form1: undefined,
    form2: undefined,
    form3: undefined,
  })

  const getFormState = useRef<(() => DefaultValues) | undefined>(undefined)

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
      <JsonUI {...args} model={model} getFormState={getFormState} defaultValues={defaultValue as any} />
    </div>
  )
}

export const StoreStateTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
StoreStateTest.args = {
  id: 'aaaa',
}

StoreStateTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
  id: { control: { type: 'text' } },
}

StoreStateTest.parameters = { controls: { include: ['model', 'id'] } }

export default JsonUIStory
