/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import conceptImage from '../../assets/concept1.png'
import stateContainer from '../../assets/state-container.svg'

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
        JsonUI is a Json based data-driven UI. It's a language to define User Interface into a canvas. When you change the definition, the canvas immediately
        follow the definition. Actually JSONUI is available for <b>react</b> and <b>react-native</b>. Means you can easily make a web, android, iphone, ipad,
        osx, linux, windows,... applications. JsonUI contains a layout definition and components style as well and the business logic in one single Json
        definition.
      </Typography>
      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        Core concept
      </Typography>
      <Typography variant="subtitle1">
        Build a data driven UI. The components as a lego elements already built-in. One single Json definition can build a user interface using these elements.
        It's a good user interface for for example a server driven application.
      </Typography>
      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 10 }}>
        <FullSizeConceptImg src={conceptImage} alt="concept" />
      </div>
      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        State container
      </Typography>
      <Typography variant="subtitle1">
        The state container based on Redux, but used a little bit unortodox way to support the idea behind JsonUI. The idea is to store data in separate stores
        and access it via Json path definition. Each data store represent a graf based(how looks like json) storage. Each component can read/write data with
        publish/subscribe logic or simple get/set way. <br />
        When a component subscribed a data, it will rerender when the data changed. The data stores are independent from the UI, but how the application can
        access data it is defined in the json.
      </Typography>
      <Typography variant="subtitle1" style={{ textAlign: 'center', margin: 20 }}>
        <FullSizeStateContainerImg src={stateContainer} alt="State container" width="80%" />
      </Typography>

      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        Data binding
      </Typography>
      <Typography variant="subtitle1">
        It's combined the UI definition and the data binding into one JSON file. A component can access data and can manipulate it before or after use. The data
        looks like a json, the built-in manipulation method{' '}
        <a href="https://jsonata.org/" target="_new">
          JSONata
        </a>{' '}
        is designed for it. Of course a new function can still manipulate data used javascript
      </Typography>
      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        Why is better than just use a program language?
      </Typography>
      <Typography variant="subtitle1">
        Under the hood it use react. Just need to define components for your particular project after just need to use it and business logic need to define and
        job done.
        <br /> Send a model to the JsonUI canvas and the application immediately show it. Less thing need to test it, less developmint time, faster workflow.
      </Typography>
    </>
  )
}

export default App
