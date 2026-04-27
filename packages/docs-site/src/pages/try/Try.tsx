import React, { useState } from 'react'
import { Stack, ListItemText, Paper, Typography } from '@mui/material'
// import JSONInput from 'react-json-editor-ajrm'
import Editor from '../../simpleCodeEditor'
import { JsonUI, JsonUINode } from '@jsonui/react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import Prism from 'prismjs'
import jsonFormat from 'json-format'
import testHello from './testHello.json'
import testButton from './testButton.json'
import testInput from './testInput.json'
import ErrorBoundary from '../../ErrorBoundary'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism.css' // Example style, you can use another

function Try() {
  const tries = [
    { name: 'Hello World', content: testHello, help: 'Simple Text example' },
    { name: 'Button', content: testButton, help: 'Button sample' },
    { name: 'Edit Field', content: testInput, help: 'Edit Field example with setter and getter' },
  ]
  const format = (data: unknown) => jsonFormat(data, { space: { size: 1 }, type: 'space' })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [jsonVal, setJsonVal] = useState(format(tries[selectedIndex].content))
  const [jsonValid, setJsonValid] = useState<JsonUINode>(tries[selectedIndex].content as JsonUINode)
  const [harError, setHasError] = useState(false)

  const handleSetSelectedIndex = (event: SelectChangeEvent<number>) => {
    const idx = Number(event.target.value)
    setJsonVal(format(tries[idx].content))
    setJsonValid(tries[idx].content)
    setSelectedIndex(idx)
  }
  const isJsonString = (str: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json = JSON.parse(str)
      if (typeof json === 'object' && json !== null) {
        return true
      }
    } catch {
      return false
    }
    return false
  }
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Please select</InputLabel>
        <Select<number>
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedIndex}
          label="Selected Index"
          onChange={handleSetSelectedIndex}
        >
          {tries.map((item, index) => (
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
      <Typography variant="h6" style={{ marginTop: 20 }}>
        Result:
      </Typography>

      <Stack spacing={2} direction="column" sx={{ width: '100%' }}>
        <Paper elevation={3} sx={{ p: 1 }}>
          <JsonUI model={jsonValid} />
        </Paper>
        <Typography variant="h6" style={{ marginTop: 20 }}>
          Definition:
        </Typography>
        <Paper elevation={3} sx={{ p: 1 }} style={{ border: harError ? '2px solid red' : '2px solid green' }}>
          <ErrorBoundary>
            <Editor
              value={jsonVal}
              onValueChange={(code) => {
                setJsonVal(code)
                if (isJsonString(code)) {
                  setHasError(false)
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  setJsonValid(JSON.parse(code))
                } else {
                  setHasError(true)
                }
              }}
              // highlight={(code) => code}
              highlight={(code) => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
              padding={0}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                outline: 'transparent',
              }}
            />
          </ErrorBoundary>
        </Paper>
      </Stack>
    </>
  )
}

export default Try
