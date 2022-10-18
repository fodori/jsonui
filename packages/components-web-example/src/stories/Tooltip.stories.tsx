import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { Tooltip as MUITooltip, Icon as MUIIcon, Button } from '../index'

const TooltipStory = {
  title: 'mui/Tooltip',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const Template: ComponentStory<typeof React.Component> = () => (
  <JsonUI
    components={{ MUITooltip, MUIIcon, Button }}
    model={{
      $comp: 'MUITooltip',
      title: 'This is a tooltip',
      arrow: true,
      placement: 'bottom',
      $children: {
        $comp: 'Button',
        $children: {
          $comp: 'MUIIcon',
          color: 'primary',
          name: 'home',
        },
      },
    }}
  />
)

export const Tooltip = Template.bind({})

export default TooltipStory
