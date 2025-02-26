import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI } from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const JsonUIStory = {
  title: 'Redux test',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof JsonUI> = (args) => <JsonUI {...args} />
const MyFunction = () => {
  console.log(' fired!!!!!! MyFunction')
  return 'age'
}
export const TwoEditAnd1Modifier = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TwoEditAnd1Modifier.args = {
  model: {
    $comp: 'Fragment',
    $children: [
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'age' },
        label: 'Field level validation',
        helperText: "it's a child age",
        onChange: { $action: 'set', store: 'data', path: 'age', jsonataDef: '$' },
      },
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'age0' },
        label: 'Field level validation',
        helperText: "it's a child age",
        onChange: { $action: 'set', store: 'data', path: 'age0', jsonataDef: '$' },
      },
      {
        $comp: 'Text',
        $children: { $modifier: 'get', store: 'data', path: 'age' },
      },
      {
        $comp: 'Text',
        $children: { $modifier: 'get', store: 'data', path: { $modifier: 'MyFunction' } },
      },
    ],
  },
  // model: {
  //   $comp: 'Text',
  //   $children: { $modifier: 'get', store: 'data', path: { $modifier: 'MyFunction' } },
  // },

  id: 'redux',
  defaultValues: {
    data: {
      age: 'Test1',
    },
  } as any,
  functions: { MyFunction },
}

TwoEditAnd1Modifier.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
  id: { control: { type: 'text' } },
}

TwoEditAnd1Modifier.parameters = { controls: { include: ['model', 'id'] } }

export const PathModifierTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PathModifierTest.args = {
  model: {
    $comp: 'Fragment',
    $pathModifiers: {
      data: { path: '/this/is/a/root/for/form' },
    },
    $children: [
      {
        $comp: 'Fragment',
        $pathModifiers: {
          data: { path: '../' },
        },
        $children: [
          {
            $comp: 'Edit',
            value: { $modifier: 'get', store: 'data', path: 'test1' },
            label: 'Edit test 1',
            onChange: { $action: 'set', store: 'data', path: 'test1', jsonataDef: '$' },
            $pathModifiers: {
              data: { path: 'hhh' },
            },
          },
        ],
      },
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'test2' },
        label: 'Edit test 2',
        onChange: { $action: 'set', store: 'data', path: 'test2', jsonataDef: '$' },
        $pathModifiers: {
          data: { path: 'bbb' },
        },
      },
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: '/test4' },
        label: 'Edit test root',
        onChange: { $action: 'set', store: 'data', path: '/test4' },
      },
      {
        $comp: 'Edit',
        value: { $modifier: 'get', store: 'data', path: 'test3' },
        label: 'Edit test 3',
        onChange: { $action: 'set', store: 'data', path: 'test3', jsonataDef: '$' },
      },
      {
        $comp: 'Text',
        $children: { $modifier: 'get', store: 'data', path: '/this/is/a/root/for/hhh/test1' },
      },
      {
        $comp: 'Text',
        $children: { $modifier: 'get', store: 'data', path: { $modifier: 'MyFunction' } },
      },
    ],
  },
  // model: {
  //   $comp: 'Text',
  //   $children: { $modifier: 'get', store: 'data', path: { $modifier: 'MyFunction' } },
  // },

  id: 'redux',
  defaultValues: {
    data: {
      age: 'Test1',
    },
  } as any,
  functions: { MyFunction },
}

PathModifierTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
  id: { control: { type: 'text' } },
}

PathModifierTest.parameters = { controls: { include: ['model', 'id'] } }

export default JsonUIStory
