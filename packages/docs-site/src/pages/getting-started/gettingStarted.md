## Installation

I assume you have already added react and react-dom.

```bash
npm install @jsonui/react

yarn add @jsonui/react
```

Optional: if you use JSONata expressions in models, install a compatible `jsonata` version (v2 is used by `@jsonui/core`).

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

After you see how the JsonUI works, you can write your own component library and your own modifiers/actions to use.
