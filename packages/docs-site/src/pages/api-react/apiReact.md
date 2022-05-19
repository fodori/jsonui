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

## LICENSE [MIT](LICENSE)

Copyright (c) 2022 Istvan Fodor.
