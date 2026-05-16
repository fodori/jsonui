# JSON UI Rendering Pipeline

How the component rendering works, from the JSON model until props are passed to the React component.

```mermaid
flowchart TD
    JSON["📄 JSON / JsonUINode\n(model prop)"]

    subgraph MOUNT["JsonUI Component Mount"]
        STORES["useStores()\nInitialize stores\nwith defaultValues"]
        VALIDATORS["Build validation registry\n+ translations"]
    end

    JSON --> MOUNT
    MOUNT --> EXPAND

    EXPAND["expandSimplifiedNode()\n\nShorthand → explicit form\nstore+path → $modifier:'get'\nonChange → $action:'set'\nauto-derive error / touched"]

    EXPAND --> RENDERNODE

    subgraph RENDERNODE["RenderNode (per node, recursive)"]
        HOOK["useRenderNodeResolution()\nAsync resolution +\ndependency tracking"]

        HOOK --> RESOLUTION

        subgraph RESOLUTION["runRenderNodeResolution()"]
            DEPS["collectGetModifierDependencies()\nTrack store subscriptions"]
            MODS["resolveModifier()\nRecursively resolve\n{$modifier} in every prop"]
            SLOTS["computeSlotChildren()\n$children / $child*\n$isList + $listItem"]
        end

        RESOLUTION --> EVENTS

        subgraph EVENTS["buildEventProps()"]
            FILTER["Filter on* props\n(onClick, onChange…)"]
            ACTIONS["resolveAction()\n{$action:'name', ...params}\n→ async event handler\n(falls back to 'set')"]
            FILTER --> ACTIONS
        end
    end

    subgraph MODCTX["ModifierContext (shared)"]
        CTX["stores\ncurrentPath\npathModifiers\nvalidators\ntranslations\nactiveLanguage"]
    end

    MODCTX -.->|"provided to"| MODS
    MODCTX -.->|"provided to"| ACTIONS

    subgraph BUILTINS["Built-in Functions"]
        GET["getModifier()\n'get' → reads store value"]
        SET["createSetAction()\n'set' → writes store value\n+ touches + validates"]
    end

    GET -.->|"used by"| MODS
    SET -.->|"fallback in"| ACTIONS

    subgraph MERGE["Props Assembly (RenderNode)"]
        RP["resolvedProps\n(from modifiers)"]
        EP["eventProps\n(from actions)"]
        IP["infraProps\n(SubmitButton context)"]
        CH["children\n(from slots)"]
        MERGED["{...resolvedProps\n...infraProps\n...eventProps\nchildren}"]
        RP --> MERGED
        EP --> MERGED
        IP --> MERGED
        CH --> MERGED
    end

    RESOLUTION --> RP
    EVENTS --> EP
    SLOTS --> CH

    MERGED --> REACT["⚛️ React Component\nButton / Edit / View / Text…\nreceives fully resolved props"]

    subgraph STORE["Store (reactive)"]
        STOREDATA["setForStore() / getForStore()\nlogical path resolution\nsubscribeChange() → re-render"]
    end

    STORE <-.->|"read/write"| GET
    STORE <-.->|"write"| SET
    STORE -.->|"triggers re-render"| HOOK
```

## Key Stages

1. **Mount** — `JsonUI` initializes stores and validation from `defaultValues`
2. **Expand** — `expandSimplifiedNode()` converts shorthand `{store, path}` into explicit `$modifier`/`$action` descriptors
3. **RenderNode (recursive)** — for each node:
   - `resolveModifier()` recursively evaluates all `{$modifier}` objects in props → static values
   - `buildEventProps()` converts `on*` props with `{$action}` specs → async React event handlers
   - `computeSlotChildren()` resolves `$children`/`$child*` recursively, handling lists
4. **Props merge** — resolved props, event handlers, infra props, and children are spread into a single object
5. **React component** receives the fully-resolved plain props

## Key Files

| Stage               | File                                                              |
| ------------------- | ----------------------------------------------------------------- |
| Entry Point         | `packages/react/src/JsonUI/JsonUI.tsx`                            |
| Node Expansion      | `packages/core/src/JsonUI/expandSimplifiedNode.ts`                |
| RenderNode Core     | `packages/react/src/JsonUI/RenderNode.tsx`                        |
| Resolution Hook     | `packages/react/src/JsonUI/renderNode/useRenderNodeResolution.ts` |
| Core Resolution     | `packages/core/src/JsonUI/renderNode/runResolution.ts`            |
| Modifier Resolution | `packages/core/src/JsonUI/resolveModifier.ts`                     |
| Action Resolution   | `packages/core/src/JsonUI/resolveAction.ts`                       |
| Event Props Builder | `packages/react/src/JsonUI/renderNode/buildEventProps.ts`         |
| Slot Children       | `packages/react/src/JsonUI/renderNode/computeSlotChildren.tsx`    |
| Get Modifier        | `packages/core/src/JsonUI/getModifier.ts`                         |
| Set Action          | `packages/core/src/JsonUI/setAction.ts`                           |
| Store               | `packages/core/src/store.ts`                                      |
| Types               | `packages/core/src/types.ts`                                      |
