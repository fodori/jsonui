import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI } from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const JsonUIStory = {
  title: 'Primitives Test',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof JsonUI> = (args) => <JsonUI {...args} />

export const PrimitivesTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PrimitivesTest.args = {
  model: [
    [1, ', ', 'simple textűáéúőóüóüöŰÁÉÚŐÓÜÖ1Íí'],
    ', ',
    2,
    ', ',
    3,
    ', ',
    4,
    ', ',
    true,
    ', ',
    false,
    ', ',
    null,
    ', ',
    9999,
    ', ',
    0.00000000003,
    ', ',
    2 / 6,
  ],
}

PrimitivesTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
}

export default JsonUIStory
