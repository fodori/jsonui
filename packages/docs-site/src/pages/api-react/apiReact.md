## JsonUI Props

### `model: Json`

Required. The JSON definition to render.

### `components?: ComponentMap`

Optional component overrides/additions. Custom components are merged with built-in components.

### `modifiers?: ModifierMap`

Optional handlers referenced by `$modifier`.

### `actions?: ActionMap`

Optional handlers referenced by `$action`.

### `initialFormStore?: FormStore`

Optional pre-initialized store instance. Use this when store lifecycle is managed outside of `JsonUI`.

### `defaultValues?: Record<string, Json>`

Optional initial values per logical store.

```tsx
<JsonUI
  model={model}
  defaultValues={{
    data: { profile: { firstName: 'John', lastName: 'Doe' } },
    ui: { isSidebarOpen: true },
  }}
/>
```

Behavior notes:

- Each top-level key is a store name.
- Initialization does not mark fields as touched.
- Error and touch data are managed in shadow stores (`<store>.error`, `<store>.touch`).

### `id?: string`

Optional form identifier, returned in `onStateExport`.

### `onStateExport?: ({ id?: string, formState: unknown }) => void`

Optional callback for exporting current logical stores. It is called on unmount and when `model`, `defaultValues`, or `id` changes.

### `defaultLanguage?: string`

Baseline language key for translation modifier usage (`$modifier: "t"`). Defaults to `"en"`.

### `activeLanguage?: string`

Current UI language key for translations. If not set, `defaultLanguage` is used.

### `platform?: "web" | "native"`

Style resolution target. Defaults to `"web"`.

## Registration Examples

### Custom action

```tsx
const SaveAction = async ({ value }, context) => {
  console.log('saving', value)
  console.log('component props', context.componentProps)
}

const model = {
  $comp: 'Button',
  $children: 'Save',
  onClick: { $action: 'SaveAction', value: 42 },
}

<JsonUI model={model} actions={{ SaveAction }} />
```

### Custom modifier

```tsx
const LabelModifier = ({ key }) => `value:${key}`

const model = {
  $comp: 'Text',
  $children: { $modifier: 'LabelModifier', key: 'age' },
}

<JsonUI model={model} modifiers={{ LabelModifier }} />
```

## Built-in Components

`@jsonui/react` includes these built-ins (just example, the best practice is to rewrite all and create own design language system):

- `View`
- `Text`
- `Button`
- `Edit`
- `Fragment`
- `Image`
- `Slider`
- `FormLayout`
- `SubmitButton`
- `StoreDebugger`
- `_Undefined` fallback component

## Operational Notes

- For standard forms, prefer model-level simplification (`store` + `path`) instead of manual `value` and `onChange` wiring.
- Keep `defaultValues` close to domain boundaries (for example `data`, `ui`, `references`) to keep models clean.
- Use `initialFormStore` only when you need explicit store ownership across multiple `JsonUI` mounts.
