import React from 'react'
import type { JsonUINode } from '@jsonui/core'
import { JsonUI, type ComponentMap } from '@jsonui/react'
import { axios } from '@jsonui/functions-example'
import { Button, TextField, Radio, Select, Checkbox, Icon, Slider, Switch, Tooltip } from '@jsonui/components-web-example'
import '@jsonui/components-web-example/dist/style.css'
import { Stack, Paper } from '@mui/material'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import jsonFormat from 'json-format'
import model from './model.json'

function AllInOne() {
  const format = (str: any) => jsonFormat(str, { space: { size: 1 }, type: 'space' })
  return (
    <Stack spacing={2} direction="column" sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ p: 1 }}>
        <JsonUI
          model={model as unknown as JsonUINode}
          functions={{ axios }}
          components={{ Button, TextField, Checkbox, Radio, Select, Icon, Slider, Switch, Tooltip } as unknown as ComponentMap}
        />
      </Paper>
      <Paper elevation={3} sx={{ p: 1 }}>
        <Editor
          value={format(model)}
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
    </Stack>
  )
}

export default AllInOne
