import React from 'react'
import { actions, JsonUI, modifiers, type ComponentMap } from '@jsonui/react'
import { axios } from '@jsonui/functions-example'
import { Button, TextField, Checkbox, Icon, Slider } from '@jsonui/components-web-example'
import '@jsonui/components-web-example/dist/style.css'
import { Stack, Paper } from '@mui/material'
import Editor from '../../simpleCodeEditor'
import Prism from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import jsonFormat from 'json-format'
import model from './model.json'
import ErrorBoundary from '../../ErrorBoundary'

function AllInOne() {
  const format = (str: any) => jsonFormat(str, { space: { size: 1 }, type: 'space' })
  return (
    <Stack spacing={2} direction="column" sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ p: 1 }}>
        <JsonUI
          model={model}
          modifiers={modifiers}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          actions={{ ...actions, axios }}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          components={{ Button, TextField, Checkbox, Icon, Slider } as unknown as ComponentMap}
        />
      </Paper>
      <Paper elevation={3} sx={{ p: 1 }}>
        <ErrorBoundary>
          <Editor
            value={format(model)}
            onValueChange={() => {}}
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
  )
}

export default AllInOne
