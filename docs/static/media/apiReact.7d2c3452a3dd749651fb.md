## Props

| Name              | Type                              | Description                                                                                                                                 |
| :---------------- | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `model`           | `any`                             | It should be a serializable non cyclic object/array/primitive values . [more info](./api-json)                                              |
| `defaultValues`   | `Record<string, object>`          | initial values of stores, the key will be the name of the store. tha value can be the initial value of the store when the JsonUI will start |
| `components`      | `Record<string, React.ReactType>` | List of React components. The key will be the name of the component and it will be available for use in `model` definition.                 |
| `functions`       | `Record<string, () => any>`       | List of function to use for `$modifier` or for `$action`. It will be available for use in `model` definition.                               |
| `disabledPersist` | `boolean`                         | default is `false`. When it false, we store app data persistently.                                                                          |

### model

The `model` is the most important property. it's contains the ui definitions and the business logic. It's usually a JSON structure or object structure which can come from an api response or a predefined Json file for example.

### defaultValues

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

### components

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

### functions

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

#### disabledPersist

By default the `disabledPersist` is true and store the a specific name of store. At the moment, just one datastore is persistent which is `data`. Means everything which is stored in `data` should be persistent (data will be available after that when the application will be restarted). Everything else not. If `disabledPersist` is false, the all built in persistency mechanism disabled.

#### LICENSE [MIT](LICENSE)

Copyright (c) 2022 Istvan Fodor.