import React from 'react'
import { Grid, Paper, Typography } from '@mui/material'

import { JsonUI } from '@jsonui/react'
import { axios } from '@jsonui/functions-example'
// import { Button, TextField, Checkbox, Radio, Select, Icon, Slider, Switch, Tooltip } from '@jsonui/components-web-example'
import model from './model.json'

function AllInOne() {
  return (
    <>
      <Typography variant="h6">Components and functions integrations example</Typography>
      <Grid container spacing={2} direction="column" justifyContent="center" alignItems="stretch">
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <JsonUI
              model={model}
              disabledPersist
              functions={{ axios }}
              // components={{ Button, TextField, Checkbox, Radio, Select, Icon, Slider, Switch, Tooltip }}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default AllInOne
