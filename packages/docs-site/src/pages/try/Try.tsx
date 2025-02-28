/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Grid, ListItemText, Paper, Typography } from '@mui/material'
// import JSONInput from 'react-json-editor-ajrm'
import Editor from 'react-simple-code-editor'
import { JsonUI } from '@jsonui/react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { highlight, languages } from 'prismjs/components/prism-core'
import jsonFormat from 'json-format'
import testHello from './testHello.json'
import testButton from './testButton.json'
import testInput from './testInput.json'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism.css' // Example style, you can use another

function Try() {
  const tries = [
    { name: 'Hello World', content: testHello, help: 'Simple Text example' },
    { name: 'Button', content: testButton, help: 'Button sample' },
    { name: 'Edit Field', content: testInput, help: 'Edit Field example with setter and getter' },
  ]
  const format = (str: string) => jsonFormat(str, { space: { size: 1 }, type: 'space' })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [jsonVal, setJsonVal] = useState(format(tries[selectedIndex].content as any))
  const [jsonValid, setJsonValid] = useState(tries[selectedIndex].content)
  const [harError, setHasError] = useState(false)

  const handleSetSelectedIndex = (event: any) => {
    setJsonVal(format(tries[event.target.value].content as any))
    setJsonValid(tries[event.target.value].content)
    setSelectedIndex(event.target.value)
  }
  const isJsonString = (str: string) => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Please select</InputLabel>
        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedIndex} label="Selected Index" onChange={handleSetSelectedIndex}>
          {tries.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <MenuItem value={index} key={index}>
              <ListItemText
                primary={item.name}
                secondary={
                  <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                    {item.help}
                  </Typography>
                }
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="h6" style={{marginTop:20}}>Result:</Typography>

      <Grid container spacing={2} direction="column" justifyContent="center" alignItems="stretch">
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <JsonUI model={jsonValid} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
      <Typography variant="h6" style={{marginTop:20}}>Definition:</Typography>
          <Paper elevation={3} sx={{ p: 1 }} style={{ border: harError ? '2px solid red' : '2px solid green' }}>
            <Editor
              value={jsonVal}
              onValueChange={(code) => {
                setJsonVal(code)
                if (isJsonString(code)) {
                  setHasError(false)
                  setJsonValid(JSON.parse(code))
                } else {
                  setHasError(true)
                }
              }}
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
    </>
  )
}

export default Try
