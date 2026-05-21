import type { Meta, StoryObj } from '@storybook/react'
import type { JSONParams, JsonUINode } from '@jsonui/core'
import { modifiers, actions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '../index.js'

const model = {
  $comp: 'View',
  style: {
    padding: 5,
    paddingTop: 0,
    fontFamily: 'system-ui',
  },
  $children: [
    {
      $comp: 'FormLayout',
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      },
      $childTop: [
        {
          $comp: 'Text',
          $children: 'Style test',
          style: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        {
          $comp: 'Text',
          $children: 'Responsive demo — resize the window to see colour change by breakpoint (base → sm → md → lg)',
          style: {
            fontSize: 12,
          },
        },
      ],
      $children: [
        {
          $comp: 'Text',
          $children: 'Slider demo',
          style: {
            fontSize: 12,
            color: '#666',
            marginBottom: 4,
          },
        },
        {
          $comp: 'Slider',
          value: {
            $modifier: 'get',
            store: 'data',
            path: '/sliderValue',
          },
          onChange: {
            $action: 'set',
            store: 'data',
            path: '/sliderValue',
          },
          min: 0,
          max: 100,
          step: 0.1,
          style: {
            width: '100%',
          },
        },
        {
          $comp: 'Text',
          style: {
            fontSize: 12,
            color: '#333',
            marginBottom: 12,
          },
          $children: {
            $modifier: 'get',
            store: 'data',
            path: '/sliderValue',
            jsonataDef: "'Slider value: ' & $",
          },
        },
      ],
    },
    {
      $comp: 'StoreDebugger',
      data: {
        $modifier: 'get',
        store: 'data',
        path: '/',
      },
      error: {
        $modifier: 'get',
        store: 'data',
        path: '/',
        type: 'ERROR',
      },
      touched: {
        $modifier: 'get',
        store: 'data',
        path: '/',
        type: 'TOUCH',
      },
    },
    {
      $comp: 'Text',
      $children: 'Responsive demo — resize the window to see padding and font size change by breakpoint (base → sm → md → lg).',
      style: {
        base: {
          fontSize: {
            $modifier: 'get',
            store: 'data',
            path: '/sliderValue',
          },
          color: 'red',
          fontWeight: 'bold',
          marginBottom: 12,
        },
        sm: {
          fontSize: {
            $modifier: 'get',
            store: 'data',
            path: '/sliderValue',
          },
          color: 'green',
          fontWeight: 'bold',
        },
        md: {
          fontSize: {
            $modifier: 'get',
            store: 'data',
            path: '/sliderValue',
          },
          color: 'blue',
          fontWeight: 'bold',
        },
        lg: {
          fontSize: {
            $modifier: 'get',
            store: 'data',
            path: '/sliderValue',
          },
          color: 'black',
          fontWeight: 'bold',
        },
      },
    },
    {
      $comp: 'Text',
      $children: 'Just simple fontSize change',
      style: {
        fontSize: {
          $modifier: 'get',
          store: 'data',
          path: '/sliderValue',
        },
        color: '#555',
        marginBottom: 12,
      },
    },
  ],
} as JsonUINode
const defaultValues = {
  data: {
    sliderValue: '5',
  },
} as JSONParams

const meta = {
  title: 'JsonUI/Style',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const Style: Story = {
  args: {
    model,
    defaultValues,
    defaultLanguage: 'en',
    activeLanguage: 'hu',
  },
}
