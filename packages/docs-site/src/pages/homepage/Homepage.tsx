/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import conceptImage from '../../assets/concept1.png'
import StateContainer from '../../assets/state-container.svg?react'

const FullSizeConceptImg = styled('img')`
  width: 100%;
  max-width: 837px;
`

const FullSizeStateContainerImg = styled('img')`
  width: 100%;
  max-width: 1092px;
`

function App() {
  return (
    <>
      <Typography variant="h3" sx={{ marginBottom: 4 }}>
        JsonUI
      </Typography>
      <Typography variant="subtitle1">
        JsonUI is a JSON-based data-driven user interface.
        <br />
        It's a language written in JSON. Data-driven because the definition defines what you will see it on the canvas. When you change the definition, the
        canvas immediately follows it. It saves you development time. JSONUI is available in <b>react</b> and <b>react-native</b>. It can be used for making
        web, android, iPhone, iPad, OSX, Linux, Windows,... applications.
      </Typography>
      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 10 }}>
        <FullSizeConceptImg src={conceptImage} alt="concept" />
      </div>
      <Typography variant="subtitle1" sx={{ margin: 2 }}>
        JsonUI definition contains:
        <ul>
          <li>layout definition</li>
          <li>components style</li>
          <li>validation</li>
          <li>data store logic</li>
        </ul>
      </Typography>
      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        Core concept
      </Typography>
      <Typography variant="subtitle1">
        This approach is better than a JSON Schema based solutions, because these have a lot's of limitations. These limitations can make it difficult to create
        complex user interfaces that are both flexible and easy to maintain. For example, JSON Schema is primarily designed for data validation and does not
        provide a comprehensive solution for defining the layout and behavior of user interfaces. The layout must follow a specific structure, which can be
        restrictive. The validation rules are limited to basic data types and formats, making it difficult to implement complex logic.
        <br />
        <br />
        That was the time when I thought, why not use a more clean, generic approach.
        <br />
        <br />
        The core concept is to use a Lego block approach. We have a set of predefined components, and we can use them to create a user interface. The layout is
        defined in the Json more freely. Each component can be configured with specific properties. In the application, we follow the same components to
        communicate with the user. This “common” language is how the program interacts with the user and makes their life easier. Because we follow this, all
        across the app, we just copy-paste the same pattern everywhere. When we create a new page or a new form we use the same theme, nearly the same behavior.
        <br />
        The components of a Lego block could already be pre-defined. For example, input fields, select fields, pie charts, images, checkboxes, radio buttons,
        buttons, date pickers…. The JSON just tells how to show it, and it contains all instance's specific definitions, for example, style, name, label, etc.
      </Typography>
      <Typography variant="subtitle1" sx={{ margin: 2 }}>
        Let's see some use-case
        <ul>
          <li>
            Workflow application, where we don’t know what we would like to show to the user. After when we install the app, we make the company-specific forms
            and ask the user to work with it
          </li>
          <li>Form builder company, where the forms will be made separately, and sent to the user device to use it.</li>
          <li>
            Company inner solution like a back office, to help develop a quick interface and for an actual problem. If the problem is not big enough to make a
            bespoke solution.
          </li>
          <li>Make rapid applications with minimal effort.</li>
          <li>Server-driven, remotely controlled UI</li>
        </ul>
      </Typography>
      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        State container
      </Typography>
      <Typography variant="subtitle1">
        As a form, it needs to store the data that the user makes it. As a form needs some data to be pre-defined, for example for drop-down fields or for
        example to update a record. Because we use JSON to define UI, we can use it to define data as well.
        <br />
        Therefore this canvas has 2 main input parameters, the ui definition and the data, we called it "default values".
        <br />
        We store it in a state container and the user can manipulate it with component interactions. The data is in separate store. Each store has a name/key.
      </Typography>
      <Typography variant="subtitle1" style={{ textAlign: 'center', margin: 20 }}>
        <StateContainer style={{ width: '100%', maxWidth: '1092' }} aria-label="State container" width="80%" />
      </Typography>

      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        Data binding
      </Typography>
      <Typography variant="subtitle1">
        Each component can read/write data with publish/subscribe logic or simple get/set way. When a component subscribes to data, it will rerender
        automatically when the data changes. If you are a React developer, you know how long to add a new definition for a form or show/hide logic. Now it’s
        dead simple. The structure of data stores is independent from the UI definition (this is the freedom sompare to a JSON Shema based solution).
        <br /> It combines the UI definition and the data binding definition into one JSON structure. The data is in JSON as well and use JSON based data
        manipulation language. Thanks npm ecosystem, we use{' '}
        <a href="https://jsonata.org/" target="_new">
          JSONata
        </a>{' '}
        for enabling a powerful way to query and manipulate JSON structure.
      </Typography>
    </>
  )
}

export default App
