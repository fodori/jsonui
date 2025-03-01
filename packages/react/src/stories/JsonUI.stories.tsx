import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI } from '../index'
import model from '../Example.json'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const JsonUIStory = {
  title: 'JsonUI Generic tests',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof JsonUI> = (args) => <JsonUI {...args} />

export const TableTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TableTest.args = {
  model,
  defaultValues: {
    data: {
      level1: {
        testList: ['oneeee5', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12', 'a13', 'a14'],
      },
    },
  },
}

TableTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
}

TableTest.parameters = { controls: { include: ['model', 'id'] } }

export const InputTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
InputTest.args = {
  model: {
    $comp: 'Edit',
    value: { $modifier: 'get', store: 'data', path: 'age' },
    label: 'Field level validation',
    helperText: "it's a child age",
    onChange: { $action: 'set', store: 'data', path: 'age', jsonataDef: '$' },
  },
  defaultValues: {
    data: {
      age: 'Test',
    },
  } as any,
}

InputTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
}

InputTest.parameters = { controls: { include: ['model', 'id'] } }

export default JsonUIStory
