import React from 'react'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import conceptImage from '../../assets/concept1.png'
import StateContainer from '../../assets/state-container.svg?react'

const FullSizeConceptImg = styled('img')`
  width: 100%;
  max-width: 837px;
`

function App() {
  return (
    <>
      <Typography variant="h3" sx={{ marginBottom: 4 }}>
        JsonUI
      </Typography>
      <Typography variant="subtitle1">
        JsonUI is a JSON-based, data-driven UI runtime.
        <br />
        The UI model defines component tree, data bindings, validation rules, and event behavior in one place. When the model changes, rendered UI follows
        immediately. JsonUI is available in <b>react</b> and <b>react-native</b> environments.
      </Typography>
      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 10 }}>
        <FullSizeConceptImg src={conceptImage} alt="concept" />
      </div>
      <Typography variant="subtitle1" sx={{ margin: 2 }}>
        A JsonUI definition can contain:
        <ul>
          <li>layout and component configuration</li>
          <li>store bindings and path-based data access</li>
          <li>inline field validation (schema or JSONata)</li>
          <li>action and modifier orchestration</li>
        </ul>
      </Typography>
      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        Core concept
      </Typography>
      <Typography variant="subtitle1">
        JsonUI is designed for server-driven and dynamic interfaces where UI structure is treated as runtime data. Instead of hardcoding each form and state
        rule in component code, teams can ship and evolve behavior through JSON definitions.
        <br />
        <br />
        The model is expressive enough for complex forms and workflows, while remaining predictable for engineering teams.
        <br />
        <br />
        Built-in simplification removes repetitive binding boilerplate: a field with `store` and `path` auto-wires value, set, error, and touched bindings.
        <br />
        This creates a stable contract between backend, frontend, and product teams.
      </Typography>
      <Typography variant="subtitle1" sx={{ margin: 2 }}>
        Typical use cases:
        <ul>
          <li>Workflow applications with configurable forms and role-specific steps.</li>
          <li>Form builder platforms that publish JSON definitions to many clients.</li>
          <li>Internal business tools requiring fast delivery without rebuilding UI from scratch.</li>
          <li>Server-driven UI where behavior can be changed without app redeploy.</li>
        </ul>
      </Typography>
      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        State container
      </Typography>
      <Typography variant="subtitle1">
        JsonUI keeps UI model and runtime state separate.
        <br />
        The renderer accepts a model plus initial state (`defaultValues` and `initialFormStore`) and maintains named logical stores.
        <br />
        Validation and touch tracking are stored in shadow stores (for example `data.error` and `data.touch`) and are consumed by components through modifiers.
      </Typography>
      <Typography variant="subtitle1" style={{ textAlign: 'center', margin: 20 }}>
        <StateContainer style={{ width: '100%', maxWidth: '1092' }} aria-label="State container" width="80%" />
      </Typography>

      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        Data binding
      </Typography>
      <Typography variant="subtitle1">
        Components read and write via built-in `get` and `set` handlers, plus custom modifiers/actions when needed. Store subscriptions trigger automatic
        rerender only where data dependencies are used.
        <br />
        JSONata support enables inline transformation logic for both read and write paths. For advanced patterns, combine inline field validation, JSONata
        expressions, and custom handlers in a controlled way.
        <br />
        JsonUI uses{' '}
        <a href="https://jsonata.org/" target="_new">
          JSONata
        </a>{' '}
        to query and transform JSON values declaratively.
      </Typography>
    </>
  )
}

export default App
