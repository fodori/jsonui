import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI } from '../index'
import AsyncExample from '../examples/AsyncExample'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const AsyncTestStory = {
  title: 'Async Test',
  component: AsyncExample,
} as ComponentMeta<typeof AsyncExample>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AsyncExample> = () => {
  return (
    <>
      oooo
      <AsyncExample />
      iii
    </>
  )
}

export const AsyncTest = Template.bind({})

AsyncTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
}

export default AsyncTestStory
