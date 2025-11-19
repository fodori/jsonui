## Installation

I assume you have already added react and react-dom.

```bash
npm install @jsonui/react batchflow jsonata@1.8.7 lodash react-redux redux

yarn add @jsonui/react batchflow jsonata@1.8.7 lodash react-redux redux
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
