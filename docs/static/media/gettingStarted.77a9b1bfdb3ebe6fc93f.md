## Installation

```bash
npm install @jsonui/react
or
yarn add @jsonui/react
```

## Basic Usage

The `JsonUI` Component is a canvas and the `model` parameter is a definition of content in Json format.

```js
import {JsonUI} from '@jsonui/react';

const Canvas = () => <JsonUI model={
    { "$comp": "Text",
      "$children": "Hello World",
      "style": { "fontSize": 30 }
    } />
```

## Next Steps

After when you see how works the JsonUI, you can write own component library and own functions to use.

#### LICENSE [MIT](LICENSE)

Copyright (c) 2022 Istvan Fodor.
