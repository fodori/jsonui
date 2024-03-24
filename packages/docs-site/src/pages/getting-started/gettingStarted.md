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

const model = {
    { "$comp": "Text",
      "$children": "Hello World",
      "style": { "fontSize": 30 }
    }

const Canvas = () => <JsonUI model={model} />
```

## Next Steps

After you see how the JsonUI works, you can write your own component library or own functions to use.
