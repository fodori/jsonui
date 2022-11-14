import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { Icon as MUIIcon } from '../index'
import '../style.css'

const ButtonStory = {
  title: 'mui/Icon',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const Template: ComponentStory<typeof React.Component> = () => (
  <div style={{ display: 'flex', gridGap: 10, flexDirection: 'column' }}>
    <JsonUI
      components={{ MUIIcon }}
      model={[
        {
          $comp: 'View',
          style: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
          },
          $children: [
            {
              $comp: 'Text',
              $children: 'Material Icon "Home"',
            },
            {
              $comp: 'MUIIcon',
              color: 'primary',
              name: 'home',
            },
          ],
        },
        {
          $comp: 'View',
          style: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
          },
          $children: [
            {
              $comp: 'Text',
              $children: 'Material Icon "delete-outlined"',
            },
            {
              $comp: 'MUIIcon',
              color: 'secondary',
              name: 'delete-outlined',
            },
          ],
        },
        {
          $comp: 'View',
          style: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
          },
          $children: [
            {
              $comp: 'Text',
              $children: 'FontAwesome Icon "facebook"',
            },
            {
              $comp: 'MUIIcon',
              type: 'FontAwesome',
              name: 'facebook',
            },
          ],
        },
        {
          $comp: 'View',
          style: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
          },
          $children: [
            {
              $comp: 'Text',
              $children: 'FontAwesome Icon "home"',
            },
            {
              $comp: 'MUIIcon',
              type: 'FontAwesome',
              color: 'success',
              name: 'home',
            },
          ],
        },
      ]}
    />
  </div>
)

export const Button = Template.bind({})

export default ButtonStory
