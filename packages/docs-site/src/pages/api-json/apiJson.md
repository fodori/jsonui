## Json Model Reference

This page documents the JSON model format consumed by `JsonUI`.

## Core Keys $comp

Defines which component should be rendered.

```json
{ "$comp": "Text", "$children": "Hello world" }
```

### `$children` and `$child*`

`$children` is the default slot. `$child*` keys are named slots for multi-slot components.

```json
{
  "$comp": "View",
  "$children": [{ "$comp": "Text", "$children": "Body" }],
  "$childFooter": { "$comp": "Text", "$children": "Footer" }
}
```

### `$modifier`

Evaluates a value at render time.

```json
{
  "$comp": "Text",
  "$children": {
    "$modifier": "get",
    "store": "data",
    "path": "/fullName"
  }
}
```

### `$action`

Defines event-time behavior (for example `onClick`, `onChange`, `onPress`).

```json
{
  "$comp": "Button",
  "$children": "Save",
  "onClick": { "$action": "set", "store": "data", "path": "/saved", "value": true }
}
```

## Store and Path

JsonUI uses named logical stores plus JSON Pointer paths.

- Store example: `data`
- Path example: `/profile/firstName`

Supported path forms:

```json
{ "path": "/profile/firstName" }
{ "path": "profile/firstName" }
{ "path": "../firstName" }
```

## Simplification: `store` + `path` Shorthand

If a node contains `store` and `path`, JsonUI expands it automatically.

Input model:

```json
{
  "$comp": "Edit",
  "store": "data",
  "path": "/profile/firstName",
  "label": "First name"
}
```

Effective behavior:

- `value` is auto-bound with `$modifier: "get"`
- `onChange` is auto-bound with `$action: "set"`
- `fieldErrors` is auto-bound to the error shadow store (`type: "ERROR"`)
- `fieldTouched` is auto-bound to the touch shadow store (`type: "TOUCH"`)

This is the recommended way to model form fields.

### SubmitButton simplification

`SubmitButton` gets `onClick: { "$action": "submit" }` automatically.

## Built-in Modifiers and Actions

### Built-in modifiers

- `get`: reads from a store/path, supports `jsonataDef`
- `jsonata`: evaluates a JSONata expression from arbitrary input parameters
- `t`: translation lookup
- `isNotTouchedOrHasError`: helper for validation-driven UI state

### Built-in actions

- `set`: writes to store/path and updates touch state automatically

## JSONata Usage

JsonUI supports JSONata in both reads and writes.

### JSONata in `get`

```json
{
  "$comp": "Text",
  "$children": {
    "$modifier": "get",
    "store": "data",
    "path": "/amount",
    "jsonataDef": "'$' & $string($)"
  }
}
```

### JSONata in `set`

`set` can transform `value` before persisting it.

```json
{
  "$comp": "Button",
  "$children": "Increment",
  "onClick": {
    "$action": "set",
    "store": "data",
    "path": "/counter",
    "value": 1,
    "jsonataDef": "$ + 1"
  }
}
```

## Inline Validation (`$validations`)

Inline validation is field-level validation attached directly to a component node.

Important:

- Inline validation runs for nodes that have `store` and `path` context.
- Validation messages are written to `<storeName>.error`.
- Touch state is tracked in `<storeName>.touch`.

### Schema validation (AJV)

```json
{
  "$comp": "Edit",
  "store": "data",
  "path": "/age",
  "$validations": [
    {
      "schema": {
        "type": "number",
        "minimum": 18,
        "errorMessage": {
          "minimum": "Age must be at least 18"
        }
      }
    }
  ]
}
```

### JSONata inline validation

```json
{
  "$comp": "Edit",
  "store": "data",
  "path": "/score",
  "$validations": [
    {
      "jsonataDef": "$number($) > 10",
      "errorMessage": "Score must be greater than 10"
    }
  ]
}
```

JSONata inline validation semantics:

- No error when result is `null`, `undefined`, `""`, or `true`
- Any other result means validation error
- `errorMessage` can be static text or a modifier expression

## Lists and Path Modifiers

Use `$isList`, `$pathModifiers`, and `$listItem` for collection rendering.

```json
{
  "$comp": "Fragment",
  "$isList": true,
  "$pathModifiers": {
    "data": { "path": "/users/list" }
  },
  "$listItem": {
    "$comp": "Edit",
    "store": "data",
    "path": "name"
  }
}
```

This keeps list item models relative while still resolving to absolute store paths.

## Practical Recommendations

- Prefer shorthand (`store` + `path`) for form fields.
- Keep validation close to fields with `$validations`.
- Use JSONata for lightweight transformations, not for complex business workflows.
- Use named stores to separate domain data, UI state, and reference data.
