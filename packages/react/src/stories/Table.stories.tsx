import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI } from '../index'
// editable table matrix
// validation
// submit
const JsonUIStory = {
  title: 'Table Test',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

const Template: ComponentStory<typeof JsonUI> = (args) => <JsonUI {...args} />

export const TableTest = Template.bind({})
TableTest.args = {
  model: {
    $comp: 'View',
    style: { marginTop: 10, backgroundColor: 'orange' },
    $children: [
      {
        $comp: 'Fragment',
        $pathModifiers: {
          data: { path: 'level1' },
        },
        $children: [
          {
            $comp: 'View',
            $isList: true,
            $pathModifiers: {
              data: { path: 'testList' },
            },
            style: {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            },
            $listItem: {
              $comp: 'View',
              $children: [
                {
                  $comp: 'Edit',
                  value: { $modifier: 'get', store: 'data', path: '.' },
                  label: 'Label',
                  helperText: 'helppertext here',
                  onChange: { $action: 'set', store: 'data', path: '.' },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  id: 'redux',
  defaultValues: {
    data: {
      level1: {
        testList: ['oneeee5', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12', 'a13', 'a14'],
      },
    },
  } as any,
}

TableTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
  id: { control: { type: 'text' } },
}

TableTest.parameters = { controls: { include: ['model', 'id'] } }

export default JsonUIStory
