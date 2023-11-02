import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI } from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const JsonUIStory = {
  title: 'Simple',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof JsonUI> = (args) => <JsonUI {...args} />

export const SimpleTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
SimpleTest.args = {
  model: [[1, 'ooo'], 2, 3, 4, true, false, null, 9999],
  disabledPersist: true,
}

SimpleTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
  id: { control: { type: 'text' } },
}

export const TextTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TextTest.args = {
  model: { $comp: 'Text', $children: 'JsonUI test page v0.1', style: { textAlign: 'center', fontSize: 30, margin: 5 } },
  disabledPersist: true,
}

TextTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
  id: { control: { type: 'text' } },
}

export default JsonUIStory
