import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI } from '../index'
import viewDef from '../Example.json'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const JsonUIStory = {
  title: 'JsonUI/First Test',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof JsonUI> = (args) => <JsonUI {...args} />

export const FirstTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
FirstTest.args = {
  viewDef,
  id: 'aaaa',
  disabledPersist: true,
  defaultValues: {
    data: {
      level1: {
        testList: ['oneeee5', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12', 'a13', 'a14'],
      },
    },
  },
}

FirstTest.argTypes = {
  viewDef: {
    control: {
      type: 'object',
    },
  },
  id: { control: { type: 'text' } },
}

FirstTest.parameters = { controls: { include: ['viewDef', 'id'] } }

export const InputTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
InputTest.args = {
  viewDef: {
    $comp: 'Edit',
    value: { $modifier: 'get', store: 'data', path: 'age' },
    label: 'Field level validation',
    helperText: "it's a child age",
    onChange: { $action: 'set', store: 'data', path: 'age', jsonataDef: '$' },
  },
  id: 'aaaa',
  disabledPersist: true,
  defaultValues: {
    data: {
      age: 'Test',
    },
  } as any,
}

InputTest.argTypes = {
  viewDef: {
    control: {
      type: 'object',
    },
  },
  id: { control: { type: 'text' } },
}

InputTest.parameters = { controls: { include: ['viewDef', 'id'] } }

export default JsonUIStory
