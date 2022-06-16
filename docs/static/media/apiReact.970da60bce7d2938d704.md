## Props

### model: _any_

The `model` is the most important property. It's contains the ui definitions and the business logic, usually a JSON structure or object structure which can come from an api response or a predefined Json file for example.

### defaultValues: _Record<string, object>_

If the JsonUI need to initialize data what the JsonUI is working on. The `defaultValues` should a name of the store and the data of it. For example if the name of the store is `questionnaire` and the initial data is a profile data.

```js
<JsonUI
  model={...}
  defaultValues={{ questionnaire:{ profile:{ firstname:'John', lastname:'Down' }}}}
/>
```

It will ba able to access with this example:

```json
{
  "$comp": "Input",
  "value": {
    "$modifier": "get",
    "store": "questionnaire",
    "path": "/firstName"
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

return <JsonUI model={model} functions={{ MyFunction }} />
```

#### disabledPersist: _boolean_

By default the `disabledPersist` is true and store the a specific name of store. At the moment, just one datastore is persistent which is `data`. Means everything which is stored in `data` should be persistent (data will be available after that when the application will be restarted). Everything else not. If `disabledPersist` is false, the all built in persistency mechanism disabled.
