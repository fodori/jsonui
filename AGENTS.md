# JSONUI — AI Instructions

## Project Summary

**JSONUI** is a JSON-based UI markup language that renders React (and React Native) components from a plain JSON model. The key idea: define your entire UI — layout, components, state bindings, event handlers — in JSON. When the JSON changes, the UI immediately reflects it.

It is designed for use cases like **remote-controlled UIs**, **form generators**, and **data-driven screens** where the UI definition can be loaded, changed, or replaced at runtime.

The project is a **yarn workspaces monorepo** with these key packages:

| Package              | Purpose                                                                            |
| -------------------- | ---------------------------------------------------------------------------------- |
| `packages/core`      | Framework-agnostic logic: store, modifier/action resolution, node expansion, types |
| `packages/react`     | React bindings: `JsonUI` component, `RenderNode`, built-in components              |
| `packages/docs-site` | Documentation website                                                              |

## Code Style

**Less code, more clarity.** The guiding principle is that code should be easy to read years later, by anyone on the team.

- Prefer **simple, direct solutions** over clever abstractions
- Write code that explains itself — avoid unnecessary comments that restate the obvious
- **Small, focused functions** with a single clear responsibility
- Avoid over-engineering: no extra layers, wrappers, or patterns unless they genuinely simplify
- Prefer **explicit** over implicit — make data flow and intent obvious
- TypeScript: use types to document intent, not to add noise

## Architecture Overview

```
JSON (JsonUINode)
  ↓ expandSimplifiedNode()       — shorthand {store, path} → explicit $modifier/$action
  ↓ RenderNode (recursive)
      ↓ resolveModifier()        — {$modifier} in props → resolved values
      ↓ buildEventProps()        — on* props with {$action} → async event handlers
      ↓ computeSlotChildren()    — $children / $child* → nested RenderNodes
  ↓ Props merged → React Component
```

State is managed by a unified **Store** (logical path resolution, reactive subscriptions). A single `FunctionMap` serves both `$modifier` (read-time) and `$action` (event-time) handlers.

## Key Concepts

- **`$comp`** — names the React component to render
- **`$modifier`** — a function called at render time to compute a prop value (e.g. read from store, translate)
- **`$action`** — a function called when an event fires (e.g. write to store, navigate)
- **`$children` / `$child*`** — slot-based children, supports lists via `$isList` + `$listItem`
- **`store` + `path`** — shorthand automatically expanded to `$modifier:'get'` / `$action:'set'`

## Build & Test

```bash
yarn install                  # install all dependencies
yarn build:libs               # build core + react packages
yarn test                     # run all tests (vitest)
yarn type-check               # TypeScript type checking
yarn lint                     # ESLint
yarn storybook                # start playground storybook
```

## Further Documentation

All in-depth AI-oriented documentation lives in [`ai-docs/`](ai-docs/):

| Document                                                         | Description                                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`ai-docs/rendering-pipeline.md`](ai-docs/rendering-pipeline.md) | Full rendering pipeline diagram and explanation, from JSON to React component |
