import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI } from '../index'

const JsonUIStory = {
  title: 'Multi Child',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

const Template: ComponentStory<typeof JsonUI> = (args) => <JsonUI {...args} />

function EditMultiChild(props: any) {
  const handleChange = (event: any) => {
    props?.onChange(event.target.value)
  }
  const { fieldErrors, validation, value, $childLabel, $childHelperText, onChange, children, ...ownProps } = props
  let error = !!fieldErrors
  let helperText = $childHelperText
  if (error && fieldErrors) {
    helperText = fieldErrors && Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors
  }
  if (validation && value && validation.jsonataDef) {
    let isValid = true
    try {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      const jsonata = require('jsonata')
      const expression = jsonata(validation.jsonataDef)
      isValid = expression.evaluate(value)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('jsonata error', validation.jsonataDef, err)
      isValid = false
    }
    if (!isValid) {
      error = true
      helperText = validation.fieldErrors && Array.isArray(validation.fieldErrors) ? validation.fieldErrors.join(', ') : validation.fieldErrors
    }
  }
  return (
    <>
      <div style={{ fontSize: 20, color: error ? 'red' : undefined }}>{$childLabel}</div>
      <p>{children}</p>
      <input {...ownProps} value={value || ''} onChange={handleChange} />
      <div style={{ fontSize: 10, color: error ? 'red' : undefined }}>{helperText}</div>
    </>
  )
}

export const MultiChild = Template.bind({})
MultiChild.args = {
  model: [
    {
      $comp: 'EditMultiChild',
      value: { $modifier: 'get', store: 'data', path: 'firstname' },
      $children: { $comp: 'Text', $children: 'simple text', style: { textAlign: 'left', fontSize: 20, margin: 5, color: 'green' } },
      $childLabel: { $comp: 'Text', $children: 'This is a label', style: { textAlign: 'left', fontSize: 20, margin: 5, color: 'red' } },
      $childHelperText: { $comp: 'Text', $children: 'Thi is a Helper Text', style: { textAlign: 'left', fontSize: 10, margin: 5 } },
      onChange: { $action: 'set', store: 'data', path: 'firstname' },
    },
    {
      $comp: 'Button',
      $children: 'Click',
    },
  ],
  components: { EditMultiChild },
}

MultiChild.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
  id: { control: { type: 'text' } },
}

export default JsonUIStory
