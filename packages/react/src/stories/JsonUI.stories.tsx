import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI } from '../index'
import viewDef from '../Example.json'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'JsonUI/FirstTest',
  component: JsonUI,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    viewDef: {
      name: 'label',
      type: { name: 'string', required: false },
      defaultValue: viewDef,
      description: 'viewDef description',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: viewDef },
      },
      control: {
        type: 'text',
      },
    },
  },
} as ComponentMeta<typeof JsonUI>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof JsonUI> = (args) => <JsonUI {...args} />

export const FirstTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
FirstTest.args = {
  viewDef,
}
