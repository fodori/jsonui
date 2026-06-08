# JSONUI

JSONUI is a JSON-based UI runtime for React ecosystems.

A single JSON model can define:

- component tree and layout
- data bindings and event actions
- field-level validation
- runtime value transformations

When the model changes, the rendered UI updates accordingly.

## Installation

This repository is a Yarn workspace monorepo.

Use Yarn:

```bash
yarn install
```

For app-level usage in React projects:

```bash
yarn add @jsonui/react
```

If your models use JSONata expressions, install `jsonata` in the target app as well.

## Quick Example

```tsx
import { JsonUI } from '@jsonui/react'

const model = {
  $comp: 'View',
  $children: [
    { $comp: 'Text', $children: 'Hello JSONUI' },
    {
      $comp: 'Edit',
      store: 'data',
      path: '/profile/firstName',
      label: 'First name',
    },
  ],
}

export function Example() {
  return <JsonUI model={model} defaultValues={{ data: { profile: { firstName: 'John' } } }} />
}
```

The `Edit` node uses simplification (`store` + `path`), which auto-wires value/set/error/touched bindings.

Store-bound text/number inputs are **uncontrolled**: the DOM owns the text while the user types, so the caret stays put and a slow/async store can't clobber keystrokes. The store value is synced back into the field only while it is not focused. To build your own input components, use the hookless `uncontrolledInputProps(value, onChange, type)` helper (`type="number"` stores a real JSON number).

## Core Model Concepts

### Components and Slots

- `$comp` chooses the component
- `$children` is the default slot
- `$child*` defines named slots

### Modifiers and Actions

- `$modifier` computes values at render time
- `$action` handles runtime events

### Built-in Store Access

- `get` reads from `store` + `path`
- `set` writes to `store` + `path`

### JSONata Support

JSONata is supported for both read and write flows.

- read: `get` with `jsonataDef`
- write: `set` with `jsonataDef`

### Inline Validation

`$validations` supports both:

- AJV schema validation
- JSONata expression validation

Validation messages are written into `<store>.error`. Touched state is tracked in `<store>.touch`.

## React API Highlights

Important `JsonUI` props:

- `model`
- `components`
- `modifiers`
- `actions`
- `defaultValues`
- `initialFormStore`
- `onStateExport`
- `id`
- `defaultLanguage`
- `activeLanguage`
- `platform`

Helpers for custom input components:

- `uncontrolledInputProps(value, onChange?, type?)` — props for an uncontrolled, caret-stable, slow-store-safe input
- `toDisplayString(value)` / `parseNumber(raw)` — value/number conversions

## Documentation

- Project docs site: https://jsonui.org
- Monorepo docs page source: `packages/docs-site`

## License

[MIT](LICENSE)
