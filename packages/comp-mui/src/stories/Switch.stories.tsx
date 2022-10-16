import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { Switch as MUISwitch } from '../index'

const SwitchStory = {
  title: 'mui/Switch',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const Template: ComponentStory<typeof React.Component> = () => (
  <div style={{ display: 'flex', gridGap: 10, flexDirection: 'row' }}>
    <JsonUI
      components={{ MUISwitch }}
      model={{
        $comp: 'MUISwitch',
        defaultChecked: true,
      }}
    />
    <JsonUI
      components={{ MUISwitch }}
      model={{
        $comp: 'MUISwitch',
        color: 'secondary',
        defaultChecked: true,
      }}
    />
    <JsonUI
      components={{ MUISwitch }}
      model={{
        $comp: 'MUISwitch',
        disabled: true,
      }}
    />
  </div>
)

export const Switch = Template.bind({})

export default SwitchStory
