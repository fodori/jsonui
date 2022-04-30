import React from 'react'
import Typography from '@mui/material/Typography'

function App() {
  return (
    <>
      <Typography variant="h3" sx={{ marginBottom: 4 }}>
        JsonUI
      </Typography>
      <Typography variant="subtitle1">
        This is a Json markup language to define User Interface as a canvas where you can draw with Json definition. When you change the Json definition, the
        interface immediately reflects on what you defined/changed. Actually JSONUI is available for <b>react</b> and <b>react-native</b>. It will be able to
        integrate to 99% of the cross-platform environments, thanks for reactjs ecosystem The UI definition contains a layout definition and components
        configuration as well. The most important it has a built in <b>state management system</b>. Data can be <b>persistent</b> or not, depends on the name of
        the store.
      </Typography>
      <Typography variant="h4" sx={{ margin: 4 }}>
        Core concept
      </Typography>
      <Typography variant="subtitle1">
        Build a data driven UI. The &quot;definition&quot; is changeable by developer anytime and any reason. If you would like to build a remote controlled app
        or a form generator app, I hope you will love it.
      </Typography>
    </>
  )
}

export default App
