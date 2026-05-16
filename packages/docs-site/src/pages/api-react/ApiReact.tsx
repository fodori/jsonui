import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import markupFile from './apiReact.md'

function App() {
  const [content, setContent] = useState('')

  useEffect(() => {
    void fetch(markupFile)
      .then((res) => res.text())
      .then((md) => {
        setContent(md)
      })
  }, [])
  return (
    <>
      <Typography variant="h3" sx={{ marginBottom: 4 }}>
        React API Reference
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 540 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: 100 }}>
                  Name
                </TableCell>
                <TableCell align="left" style={{ minWidth: 100 }}>
                  Type
                </TableCell>
                <TableCell align="left" style={{ minWidth: 200 }}>
                  Description
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">model</TableCell>
                <TableCell align="left">Json</TableCell>
                <TableCell align="left">Required JSON model that defines component tree, bindings, and behavior.</TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">defaultValues</TableCell>
                <TableCell align="left">{'Record<string, JSONObject>'}</TableCell>
                <TableCell align="left">
                  Initial values per logical store.
                  <br />
                  Example: {`{ data: { firstName: 'Jon' }, ui: { loading: false } }`}
                  <br />
                  Initialization does not mark fields as touched.
                </TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">initialFormStore</TableCell>
                <TableCell align="left">FormStore</TableCell>
                <TableCell align="left">Optional pre-created store instance. Use when store lifecycle is managed outside JsonUI.</TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">components</TableCell>
                <TableCell align="left">{'Record<string, React.ReactType>'}</TableCell>
                <TableCell align="left">Custom components merged with built-in components. Keys are referenced by `$comp` in the model.</TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">modifiers</TableCell>
                <TableCell align="left">{'Record<string, (params, context) => unknown>'}</TableCell>
                <TableCell align="left">Custom modifier handlers referenced by `$modifier`.</TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">actions</TableCell>
                <TableCell align="left">{'Record<string, (params, context) => void | Promise<void>>'}</TableCell>
                <TableCell align="left">Custom action handlers referenced by `$action`. Action context contains `componentProps`.</TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">defaultLanguage</TableCell>
                <TableCell align="left">string</TableCell>
                <TableCell align="left">Baseline language code for translation modifier usage (`$modifier: "t"`). Default is `en`.</TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">activeLanguage</TableCell>
                <TableCell align="left">string</TableCell>
                <TableCell align="left">Active language code for runtime translation lookup. Falls back to `defaultLanguage`.</TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">platform</TableCell>
                <TableCell align="left">{'"web" | "native"'}</TableCell>
                <TableCell align="left">Style resolution target platform. Default is `web`.</TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">onStateExport</TableCell>
                <TableCell align="left">{'({ id?: string, formState: JSONValue}) => void'}</TableCell>
                <TableCell align="left">
                  Callback that receives current logical stores and optional id on unmount and on model/defaultValues/id change.
                </TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">id</TableCell>
                <TableCell align="left">{'string'}</TableCell>
                <TableCell align="left">Optional identifier returned by `onStateExport`.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </>
  )
}

export default App
