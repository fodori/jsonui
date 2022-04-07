import React, { useState } from 'react'
import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import { HashRouter } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { Grid, Paper } from '@mui/material'
import JSONInput from 'react-json-editor-ajrm'
import { JsonUI } from '@jsonui/react'
import locale from './react-json-editor-en'

function App() {
  const [jsonVal, setJsonVal] = useState({
    $comp: 'Text',
    $children: 'Hello World',
    style: {
      textAlign: 'center',
      fontSize: 60,
    },
  })
  return (
    <HashRouter>
      <CssBaseline />
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item>
          <Typography variant="h1" style={{ fontWeight: 900, opacity: '80%', color: 'darkslateblue' }}>
            - JsonUI -
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h2" style={{ fontWeight: 900 }}>
            Coming soon
          </Typography>
        </Grid>
        <Grid item style={{ marginTop: 40 }}>
          <Paper style={{ padding: 24 }} elevation={6}>
            <Typography variant="subtitle2" style={{ fontWeight: 900 }}>
              All information is on GitHub at the moment.
            </Typography>
            <Typography variant="subtitle1" style={{ fontWeight: 900 }}>
              <a href="https://github.com/fodori/jsonui">https://github.com/fodori/jsonui</a>
            </Typography>
            <Typography variant="subtitle1" style={{ fontWeight: 900 }}>
              or
            </Typography>
            <Typography variant="subtitle1" style={{ fontWeight: 900 }}>
              <a href="https://www.npmjs.com/package/@jsonui/react">https://www.npmjs.com/package/@jsonui/react</a>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container direction="row" justifyContent="center" alignItems="flex-start">
        <Grid item style={{ marginTop: 40, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <JSONInput
                placeholder={{
                  $comp: 'Text',
                  $children: 'Hello World',
                  style: {
                    textAlign: 'center',
                    fontSize: 60,
                  },
                }}
                height="150"
                theme="dark_vscode_tribute"
                locale={locale}
                onChange={(value: any) => {
                  if (!value.error) {
                    setJsonVal(value.jsObject)
                  }
                }}
                waitAfterKeyPress={10}
              />
            </Grid>
            <Grid item xs={6}>
              <JsonUI viewDef={jsonVal} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </HashRouter>
  )
}

export default App
