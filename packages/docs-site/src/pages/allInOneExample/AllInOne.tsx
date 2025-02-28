import React from 'react'

import { JsonUI } from '@jsonui/react'
import { axios } from '@jsonui/functions-example'
import { Button, TextField, Radio, Select, Checkbox, Icon, Slider, Switch, Tooltip } from '@jsonui/components-web-example'
import '@jsonui/components-web-example/dist/style.css'
import { Grid, Paper } from '@mui/material'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import jsonFormat from 'json-format'
import model from './model.json'

function AllInOne() {
  const format = (str: any) => jsonFormat(str, { space: { size: 1 }, type: 'space' })
  return (
    <Grid container spacing={2} direction="column" justifyContent="center" alignItems="stretch">
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 1 }}>
          <JsonUI model={model} functions={{ axios }} components={{ Button, TextField, Checkbox, Radio, Select, Icon, Slider, Switch, Tooltip }} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 1 }}>
          <Editor
            value={format(model)}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onValueChange={() => {}}
            highlight={(code) => highlight(code, languages.js)}
            padding={0}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              outline: 'transparent',
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default AllInOne
