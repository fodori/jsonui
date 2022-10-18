import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { Radio as MUIRadio } from '../index'

const RadioStory = {
  title: 'mui/Radio',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const Template: ComponentStory<typeof React.Component> = () => (
  <div style={{ display: 'flex', gridGap: 10, flexDirection: 'row' }}>
    <JsonUI
      components={{ MUIRadio }}
      model={{
        $comp: 'MUIRadio',
        defaultChecked: true,
      }}
    />
    <JsonUI
      components={{ MUIRadio }}
      model={{
        $comp: 'MUIRadio',
        color: 'secondary',
        defaultChecked: true,
      }}
    />
    <JsonUI
      components={{ MUIRadio }}
      model={{
        $comp: 'MUIRadio',
        disabled: true,
      }}
    />
  </div>
)

export const Radio = Template.bind({})

export default RadioStory
