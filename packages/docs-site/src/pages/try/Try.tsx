/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Grid, Typography } from '@mui/material'
import JSONInput from 'react-json-editor-ajrm'
import { JsonUI } from '@jsonui/react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import locale from '../../react-json-editor-en'
import testHello from './testHello.json'
import testButton from './testButton.json'
import testInput from './testInput.json'

function Try() {
  const tries = [
    { name: 'Hello World', content: testHello, help: 'Simple Text' },
    { name: 'Button', content: testButton, help: 'Button Text' },
    { name: 'Edit Field', content: testInput, help: 'Edit Field example' },
  ]
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [jsonVal, setJsonVal] = useState(tries[selectedIndex].content)

  const handleSetSelectedIndex = (event: any) => {
    setJsonVal(tries[event.target.value].content)
    setSelectedIndex(event.target.value)
  }
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Examples</InputLabel>
        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedIndex} label="Selected Index" onChange={handleSetSelectedIndex}>
          {tries.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <MenuItem value={index} key={index}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* {JSON.stringify(tries?.[selectedIndex]?.content)} */}
      <Typography variant="subtitle1">{tries?.[selectedIndex]?.help}</Typography>
      <Grid item style={{ marginTop: 40, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <JSONInput
              placeholder={tries[selectedIndex].content}
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
            <JsonUI model={jsonVal} disabledPersist />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default Try
