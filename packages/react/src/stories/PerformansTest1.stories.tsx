import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI } from '../index'

const model = {
  $comp: 'View',
  $pathModifiers: {
    data: { path: 'list' },
  },
  $isList: true,
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
        value: { $modifier: 'get', store: 'data', path: '/name' },
        onChange: { $action: 'set', store: 'data', path: '/name' },
        style: { width: 50, height: 20 },
      },
    ],
  },
}

const JsonUIStory = {
  title: 'Performance tests',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof JsonUI & any> = ({ iteration, ...args }) => {
  return (
    <>
      <p>{iteration}</p>
      <JsonUI {...args} defaultValues={{ data: { list: Array(iteration).fill('a', 0) } }} iteration={iteration} />
    </>
  )
}

export const InputTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
InputTest.args = {
  model,
  iteration: 400,
}

InputTest.argTypes = {
  iteration: { control: { type: 'number' } },
}

InputTest.parameters = { controls: { include: ['iteration'] } }

export default JsonUIStory
