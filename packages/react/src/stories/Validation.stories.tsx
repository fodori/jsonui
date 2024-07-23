import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { constants as c, JsonUIFunctionType } from '@jsonui/core'
import FormResult from '../stock/components/FormResult'

import { JsonUI } from '../index'

const JsonUIStory = {
  title: 'Validation Test',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

const Template: ComponentStory<typeof JsonUI> = (args) => <JsonUI {...args} />

const submit: JsonUIFunctionType = (attr, props, callerArgs) => {
  console.log(' ---- submit ---- ')
  console.log('attr: ', attr)
  console.log('props: ', props)
  console.log('callerArgs: ', callerArgs)
}

export const ValidationTest = Template.bind({})
ValidationTest.args = {
  model: {
    $comp: 'View',
    id: 'view',
    style: { marginTop: 10 },
    $children: [
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
  id: 'redux',
  disabledPersist: true,
  defaultValues: {
    data: {
      name1: '7',
    },
  } as any,
  components: { FormResult },
  functions: { submit },
}

ValidationTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
  id: { control: { type: 'text' } },
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
