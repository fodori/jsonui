import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { constants as c, JsonUIFunctionType } from '@jsonui/core'
import FormResult from '../stock/components/FormResult'

import { JsonUI } from '../index'

const JsonUIStory = {
  title: 'Validation Test',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

const RadioGroupField = (props: any) => {
  const handleChange = (event: any) => {
    props?.onChange(JSON.parse(event.target.value))
  }
  const { fieldErrors, validation, value, $childLabel, $childHelperText, onChange, children, options, ...ownProps } = props
  let error = !!fieldErrors
  let helperText = $childHelperText
  if (error && fieldErrors) {
    helperText = fieldErrors && Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors
  }
  return (
    <>
      <div style={{ fontSize: 20, color: error ? 'red' : undefined }}>{$childLabel}</div>
      <p>{children}</p>
      {options.map((i: any) => {
        const itemValue = typeof i === 'string' ? i : i.value
        const checked = value === itemValue
        return (
          <div key={i.value}>
            <input {...ownProps} value={JSON.stringify(i.value)} onChange={handleChange} type="radio" checked={checked} />
            <label>{i.label}</label>
          </div>
        )
      })}
      <div style={{ fontSize: 10, color: error ? 'red' : undefined }}>{helperText}</div>
    </>
  )
}

const Template: ComponentStory<typeof JsonUI> = (args) => <JsonUI {...args} />

const submit: JsonUIFunctionType = (attr, props, callerArgs, stock) => {
  // const state = stock.reduxStore.getState()
  const result = stock.callFunction('get', attr, props, callerArgs, stock)
  console.log(' ---- submit ---- ')
  console.log(result)
}

export const ValidationTest = Template.bind({})
ValidationTest.args = {
  model: {
    $comp: 'View',
    id: 'view',
    style: { marginTop: 10 },
    $children: [
      {
        $comp: 'RadioGroupField',
        name: 'showNow',
        $childLabel: 'Show now',
        $childHelperText: '',
        placeholder: '',
        fieldErrors: { $modifier: 'get', store: 'data', path: 'showNow', type: 'ERROR' },
        fieldTouched: { $modifier: 'get', store: 'data', path: 'showNow', type: 'TOUCH' },
        value: {
          $modifier: 'get',
          store: 'data',
          path: 'showNow',
        },
        onChange: {
          $action: 'set',
          store: 'data',
          path: 'showNow',
        },
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ],
        required: false,
        fullWidth: false,
        style: {
          minWidth: 100,
        },
      },
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'firstname' },
        label: 'First Name',
        helperText: 'more than 2 character and less than 10',
        onChange: {
          $action: 'set',
          store: 'data',
          path: 'firstname',
        },
        fieldErrors: { $modifier: 'get', store: 'data', path: 'firstname', type: 'ERROR' },
        fieldTouched: { $modifier: 'get', store: 'data', path: 'firstname', type: 'TOUCH' },
      },
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'email' },
        label: 'E-mail address',
        helperText: "we don't accept any another format",
        onChange: { $action: 'set', store: 'data', path: 'email' },
        fieldErrors: { $modifier: 'get', store: 'data', path: 'email', type: 'ERROR' },
        fieldTouched: { $modifier: 'get', store: 'data', path: 'email', type: 'TOUCH' },
      },
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'anotherText' },
        label: 'Single schema test',
        helperText: 'helppertext here',
        onChange: { $action: 'set', store: 'data', path: 'anotherText' },
        fieldErrors: { $modifier: 'get', store: 'data', path: 'anotherText', type: 'ERROR' },
        fieldTouched: { $modifier: 'get', store: 'data', path: 'anotherText', type: 'TOUCH' },
      },
      { $comp: 'Text', $children: 'Data', style: { fontSize: 20 } },
      { $comp: 'FormResult', value: { $modifier: 'get', store: 'data', path: '/' } },
      { $comp: 'Text', $children: 'Error', style: { fontSize: 20 } },
      { $comp: 'FormResult', value: { $modifier: 'get', store: `data${c.STORE_ERROR_POSTFIX}`, path: '/' } },
      { $comp: 'Text', $children: 'Touched', style: { fontSize: 20 } },
      { $comp: 'FormResult', value: { $modifier: 'get', store: `data${c.STORE_TOUCH_POSTFIX}`, path: '/' } },

      {
        $comp: 'Button',
        id: 'submitbutton',
        onClick: { $action: 'submit', store: 'data', path: '/' },
        $children: 'Submit',
        disabled: {
          $modifier: 'jsonata',
          jsonataDef: 'error = true or touched = false',
          error: { $modifier: 'get', store: 'data', path: '/', type: 'ERROR', jsonataDef: '$ !=null' },
          touched: { $modifier: 'get', store: 'data', path: '/', type: 'TOUCH' },
        },
      },
    ],
    $validations: [
      {
        schema: {
          type: 'object',
          properties: {
            firstname: {
              type: 'string',
              minLength: 3,
              maxLength: 9,
              errorMessage: {
                minLength: 'too small',
                maxLength: 'too big',
              },
            },
            email: {
              type: 'string',
              format: 'email',
              errorMessage: {
                format: 'should be email',
              },
            },
          },
          required: ['firstname', 'email'],
          errorMessage: {
            required: {
              firstname: 'firstname is required',
              email: 'email is required',
            },
          },
        },
        path: '/',
        store: 'data',
      },
      {
        schema: {
          type: 'string',
          minLength: 2,
          maxLength: 4,
        },
        path: '/anotherText',
        store: 'data',
      },
    ],
  },
  defaultValues: {
    data: {
      firstname: 'Jon',
      email: 'a@a.com',
      anotherText: 'somethin',
    },
  } as any,
  components: { FormResult, RadioGroupField },
  functions: { submit },
}

ValidationTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
}

ValidationTest.parameters = { controls: { include: ['model', 'id'] } }

export default JsonUIStory

/**
 * TODO:
 * how is help submit to validate the whole form
 * touch
 * dirty
 *
 * */
