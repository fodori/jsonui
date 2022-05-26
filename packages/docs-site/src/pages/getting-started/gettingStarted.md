## Installation

```bash
npm install @jsonui/react
or
yarn add @jsonui/react
```

## Basic Usage

The `JsonUI` Component is a canvas and the `viewDef` parameter is a definition of content in Json format.

```js
import {JsonUI} from '@jsonui/react';

const Canvas = () => <JsonUI viewDef={
    { "$comp": "Text",
      "$children": "Hello World",
      "style": { "fontSize": 30 }
    } />
```

## Next Steps

After when you see how works the JsonUI, you can write own component library and own functions to use.

Our todo list:

- create some component library, for example MUI on web
- create a api communication library under http protocol
- create some application examples to see what the application is capable of.

#### LICENSE [MIT](LICENSE)

Copyright (c) 2022 Istvan Fodor.
