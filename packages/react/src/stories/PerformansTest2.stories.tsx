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
        $comp: 'View',
        style: { width: 10, height: 10, background: 'green', margin: 2 },
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
export const BoxTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
BoxTest.args = {
  model,
  iteration: 400,
}

BoxTest.argTypes = {
  iteration: { control: { type: 'number' } },
}

BoxTest.parameters = { controls: { include: ['iteration'] } }
export default JsonUIStory
