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
        value: { $modifier: 'get', store: 'data', path: 'name1' },
        label: 'Name 1',
        helperText: 'helppertext here',
        onChange: { $action: 'set', store: 'data', path: 'name1' },
      },
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'name2' },
        label: 'Name 2',
        helperText: 'helppertext here',
        onChange: { $action: 'set', store: 'data', path: 'name2' },
      },
      { $comp: 'Text', $children: 'Data', style: { fontSize: 20 } },
      { $comp: 'FormResult', value: { $modifier: 'get', store: 'data', path: '/' } },
      { $comp: 'Text', $children: 'Data Error', style: { fontSize: 20 } },
      { $comp: 'FormResult', value: { $modifier: 'get', store: `data${c.STORE_ERROR_POSTFIX}`, path: '/' } },
    ],
    $validations: [
      {
        schema: {
          type: 'object',
          properties: {
            name1: {
              type: 'string',
              minLength: 2,
              maxLength: 10,
            },
            name2: {
              type: 'string',
              minLength: 4,
              maxLength: 10,
            },
          },
          required: ['name1', 'name2'],
        },
        path: '/',
        store: 'data',
      },
    ],
  },
  id: 'redux',
  disabledPersist: true,
  defaultValues: {
    data: {
      name1: '7',
      name2: '9',
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
 * BUG:
 * validation global doesn't work
 * TODO:
 * test global validation,
 * field level validation,
 * multiple validation,
 * multiple button/condition validation
 * touch,
 * show validation data (globally, field level with same path, add to a different component)
 *
 * */
