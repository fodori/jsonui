import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { constants as c } from '@jsonui/core'
import FormResult from '../stock/components/FormResult'

import { JsonUI } from '../index'

const JsonUIStory = {
  title: 'Validation Test',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

const Template: ComponentStory<typeof JsonUI> = (args) => <JsonUI {...args} />

export const ValidationTest = Template.bind({})
ValidationTest.args = {
  model: {
    $comp: 'View',
    style: { marginTop: 10 },
    $children: [
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'name5' },
        label: 'Field level schema test',
        helperText: 'helppertext here',
        onChange: {
          $action: 'set',
          store: 'data',
          path: 'name5',
        },
        fieldErrors: { $modifier: 'get', store: 'data', path: 'name5', type: 'ERROR' },
      },
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'name1' },
        label: 'E-mail address',
        helperText: "we don't accept any another format",
        onChange: { $action: 'set', store: 'data', path: 'name1' },
        fieldErrors: { $modifier: 'get', store: 'data', path: 'name1', type: 'ERROR' },
      },
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'name2' },
        label: 'Length test',
        helperText: 'helppertext here',
        onChange: { $action: 'set', store: 'data', path: 'name2' },
        fieldErrors: { $modifier: 'get', store: 'data', path: 'name2', type: 'ERROR' },
      },

      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'name3' },
        label: 'Single schema test',
        helperText: 'helppertext here',
        onChange: { $action: 'set', store: 'data', path: 'name3' },
        fieldErrors: { $modifier: 'get', store: 'data', path: 'name3', type: 'ERROR' },
      },
      { $comp: 'Text', $children: 'Data', style: { fontSize: 20 } },
      { $comp: 'FormResult', value: { $modifier: 'get', store: 'data', path: '/' } },
      { $comp: 'Text', $children: 'Data Error', style: { fontSize: 20 } },
      { $comp: 'FormResult', value: { $modifier: 'get', store: `data${c.STORE_ERROR_POSTFIX}`, path: '/' } },
      { $comp: 'Text', $children: 'Data touched', style: { fontSize: 20 } },
      { $comp: 'FormResult', value: { $modifier: 'get', store: `data${c.STORE_TOUCH_POSTFIX}`, path: '/' } },
    ],
    $validations: [
      {
        schema: {
          type: 'object',
          properties: {
            name5: {
              type: 'string',
              format: 'email',
              minLength: 2,
              maxLength: 50,
              errorMessage: {
                format: 'should be email',
              },
            },
            name1: {
              type: 'string',
              format: 'email',
              minLength: 2,
              maxLength: 50,
              errorMessage: {
                format: 'should be email',
              },
            },
            name2: {
              type: 'string',
              minLength: 4,
              maxLength: 10,
              errorMessage: {
                type: 'should be string', // will not replace internal "type" error for the property "foo"
                minLength: 'minLength ',
                maxLength: 'maxLength',
              },
            },
          },
          required: ['name1', 'name2'],
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
        path: '/name3',
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
