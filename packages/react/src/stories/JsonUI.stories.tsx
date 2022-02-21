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

export default JsonUIStory
