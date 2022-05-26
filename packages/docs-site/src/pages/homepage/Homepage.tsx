/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import Typography from '@mui/material/Typography'

function App() {
  return (
    <>
      <Typography variant="h3" sx={{ marginBottom: 4 }}>
        JsonUI
      </Typography>
      <Typography variant="subtitle1">
        JsonUI is a Json markup language to define User Interface into a canvas. When you change the Json definition, the interface immediately change as well.
        Actually JSONUI is available for <b>react</b> and <b>react-native</b>. Means you can easily make a web, android, iphone, ipad, osx, linux, windows,...
        application thanks for reactjs. JsonUI contains the layout definition and components style as well and the business logic in one single Json definition.
      </Typography>
      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        Core concept
      </Typography>
      <Typography variant="subtitle1">
        Build a data driven UI. The components as a lego elements already exists and part of the application. One single Json definition can build an user
        interface using these elements.
      </Typography>
      <Typography variant="h4" sx={{ margin: 4, marginLeft: 0 }}>
        Why is better than just use a program language?
      </Typography>
      <Typography variant="subtitle1">
        Under the hood it use react. Just the if the components are pre-deployed for user's application just the layout and business logic need to define and
        job done. <br />
        It's save lot's of time.
        <br /> Send a message to the app or generate Json based on a response, it's easy and the application immediately change it. Less thing need to test it,
        less developmint time, faster workflow. <br />
        <b>It's a possibility to build a nearly real-time releasing capable application.</b>
      </Typography>
    </>
  )
}

export default App
