import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { Checkbox as MUICheckbox } from '../index'

const CheckboxStory = {
  title: 'mui/Checkbox',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const Template: ComponentStory<typeof React.Component> = () => (
  <div style={{ display: 'flex', gridGap: 10, flexDirection: 'row' }}>
    <JsonUI
      components={{ MUICheckbox }}
      model={{
        $comp: 'MUICheckbox',
        defaultChecked: true,
      }}
    />
    <JsonUI
      components={{ MUICheckbox }}
      model={{
        $comp: 'MUICheckbox',
        color: 'secondary',
        defaultChecked: true,
      }}
    />
    <JsonUI
      components={{ MUICheckbox }}
      model={{
        $comp: 'MUICheckbox',
        disabled: true,
      }}
    />
  </div>
)

export const Checkbox = Template.bind({})

export default CheckboxStory
