import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { axios } from '../index'

const AxiosStory = {
  title: 'mui/Axios',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const Template: ComponentStory<typeof React.Component> = () => (
  <JsonUI
    functions={{ axios }}
    model={[
      {
        $comp: 'Button',
        $children: 'Send a post',
        onClick: {
          $action: 'axios',
          method: 'post',
          url: '/user/12345',
          data: {
            firstName: 'Fred',
            lastName: 'Flintstone',
          },
        },
      },
    ]}
  />
)

export const Axios = Template.bind({})

export default AxiosStory
