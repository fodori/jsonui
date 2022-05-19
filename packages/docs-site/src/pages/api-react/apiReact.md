## Installation

```bash
npm install @jsonui/react

yarn add @jsonui/react
```

## Basic Usage

The `JsonUI` Component is a canvas and the `viewDef` parameter contains the UI definition in Json format.

```js
import {JsonUI} from '@jsonui/react';

const Canvas = () => <JsonUI viewDef={
    { "$comp": "Text",
      "$children": "Hello World",
      "style": { "fontSize": 30 }
    } />
```

### Props

| Name              | Type                                             | Description                                                                                                                                   |
| :---------------- | :----------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `viewDef`         | `any`                                            | It should be a serializable json format . [more info](./api-json)                                                                             |
| `defaultValues`   | `[key: string]: Record<string, object>`          | initial values, the key will be the name of the store. tha value can be primitive, array, object                                              |
| `id`              | `string`                                         | this is the id of the data. It can separate if you would like to use miltiple instance or you would like to separate apps with same instance. |
| `components`      | `[key: string]: Record<string, React.ReactNode>` | List of React components. The key will be the name of the component.                                                                          |
| `functions`       | `[key: string]: ()=>any`                         | List of function to use for modifier or for action                                                                                            |
| `disabledPersist` | `boolean`                                        | default is `false`. When it true, we store app data persistently.                                                                             |

#### viewDef

The `viewDef` is main parameter it's contains the ui definitions and the business logic of your JsonUI. It's usually a JSON structure or object structure which can come from an api response for example.

#### defaultValues

If the JsonUI need to initialize data what the JsonUI is working on. The `defaultValues` should a name of the store and the data of it. For example if the name of the store is `questionnaire` and the initial data is a profile data.

```js
<JsonUI
  viewDef={...}
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

#### id

The `id` is the key of the persistent store. It can store multiple different dataset for multiple application driven by `id` For example if the id of FormA will be id="FormA" and the id of FormB will be id="FormB" then these forms can work on a different namespace doesn't matter what

#### components

This is the way to add more components. For example to add MUI Switch component:

```js
import Switch from '@mui/material/Switch';

const MySwitch = (...props)=><Switch {...props}>

<JsonUI
  viewDef={{
    "component": "Switch",
    "checked": { "$modifier": "get", "store": "data", "path": "subscribe" },
    "onChange": { "$action": "set", "store": "data", "path": "subscribe" }
  }}
  components={{ Switch: MySwitch }}
/>
```

#### functions

This is the way to add more functions. For example:

```js
import Switch from '@mui/material/Switch'

const MyFunction = () => {
  console.log('Hello World')
}

return (
  <JsonUI
    viewDef={{
      component: 'Button',
      onClick: { $action: 'MyFunction' },
    }}
    components={{ Switch: MySwitch }}
  />
)
```

#### disabledPersist

By default the `disabledPersist` is true and store the a specific name of store. At the moment, just one datastore is persistent which is `data`. Means everything which is stored in `data` should be persistent (data will be available after that when the application will be restarted). Everything else not. If `disabledPersist` is false, the all built in persistency mechanism disabled.

## LICENSE [MIT](LICENSE)

Copyright (c) 2022 Istvan Fodor.
