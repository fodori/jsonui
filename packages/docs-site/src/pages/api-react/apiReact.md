## Props

### model: _any_

The `model` is the most important property. It contains the UI definitions and the business logic, usually a JSON structure or object structure which can come from an API response or a predefined JSON file for example.

### defaultValues: _Record<string, object>_

If the JsonUI needs to initialise data, this is what the JsonUI is working on.
The `defaultValues` should be the name of the store and the data of it. For example, if the name of the store is a `questionnaire` and the initial data of a profile.

```js
<JsonUI
  model={...}
  defaultValues={{ questionnaire:{ profile:{ firstName:'John', lastName:'Down' }}}}
/>
```

It will be able to access with this example:

```json
{
  "$comp": "Input",
  "value": {
    "$modifier": "get",
    "store": "questionnaire",
    "path": "/profile/firstName"
  }
}
```

### components: _Record<string, React.ReactType>_

This is the way to add more components. For example to add MUI Switch component:

```js
import Switch from '@mui/material/Switch'

const MySwitch = (...props) => <Switch {...props} />
const model = {
  $comp: 'Switch',
  checked: {
    $modifier: 'get',
    store: 'data',
    path: 'subscribe',
  },
  onChange: {
    $action: 'set',
    store: 'data',
    path: 'subscribe',
  },
}

return <JsonUI model={model} components={{ Switch: MySwitch }} />
```

### functions: _Record<string, () => any>_

This is the way to add more functions. For example:

```js
import Button from '@mui/material/Button'

const MyFunction = () => {
  console.log('Hello World')
}
const model = {
  $comp: 'Button',
  onClick: { $action: 'MyFunction' },
}

return <JsonUI model={model} functions={{ MyFunction }} components={{ Button }} />
```

#### getFormState: React.MutableRefObject<(() => DefaultValues) | undefined>

Get the actual state of the form for store it persistently if needed. Use useRef to create a reference and pass you can give it to JsonUI component. Check the Storybook example how to use it.
