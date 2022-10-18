import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { Slider as MUISlider } from '../index'

const SliderStory = {
  title: 'mui/Slider',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const Template: ComponentStory<typeof React.Component> = () => (
  <div style={{ display: 'flex', gridGap: 10, flexDirection: 'column' }}>
    <JsonUI
      components={{ MUISlider }}
      model={[
        {
          $comp: 'MUISlider',
          name: 'age',
          value: { $modifier: 'get', store: 'anotherstore', path: '/age' },
          onChange: { $action: 'set', store: 'anotherstore', path: '/age' },
        },
        {
          $comp: 'Text',
          $children: { $modifier: 'get', store: 'anotherstore', path: '/age' },
        },
      ]}
    />
  </div>
)

export const Slider = Template.bind({})

export default SliderStory
