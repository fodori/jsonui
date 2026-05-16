## Installation

Assuming your app already includes React and React DOM:

```bash
yarn add @jsonui/react
```

or

```bash
npm install @jsonui/react
```

If your models use JSONata expressions, install `jsonata` as well.

## Quick Start

```tsx
import { JsonUI } from '@jsonui/react'

const model = {
  $comp: 'View',
  $children: [
    {
      $comp: 'Text',
      $children: 'Hello JsonUI',
    },
    {
      $comp: 'Edit',
      store: 'data',
      path: '/profile/firstName',
      label: 'First name',
    },
  ],
}

export function Example() {
  return (
    <JsonUI
      model={model}
      defaultValues={{
        data: {
          profile: { firstName: 'John' },
        },
      }}
    />
  )
}
```

This example already uses simplification (`store` + `path`) so field value, change handling, error binding, and touched binding are wired automatically.

## What To Learn Next

1. Json model reference: see Json API page.
2. React integration props: see React API page.
3. Validation patterns: read inline validation section in Json API.
4. JSONata transformations: read get/set JSONata examples in Json API.
