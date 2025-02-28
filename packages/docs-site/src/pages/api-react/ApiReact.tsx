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
    fetch(markupFile)
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
        <TableContainer sx={{ maxHeight: 440 }}>
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
                <TableCell align="left">any (json)</TableCell>
                <TableCell align="left">It should be a serializable, non-cyclic object/array/primitive value.</TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">defaultValues</TableCell>
                <TableCell align="left">{'Record<string, object>'}</TableCell>
                <TableCell align="left">
                  Initial values of stores, the key will be the name of the store. The value can be the initial value of the store when the JsonUI starts.
                  <br />
                  For example: {`{ data : { firstName : 'Jon' } }`}
                  <br />
                  It's store <b>Jon</b> name into <b>firstName</b> attribute of the <b>data</b> store
                </TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">components</TableCell>
                <TableCell align="left">{'Record<string, React.ReactType>'}</TableCell>
                <TableCell align="left">
                  List of React components. The key will be the name of the component and it will be available for use in `model` definition.
                </TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">functions</TableCell>
                <TableCell align="left">{'Record<string, () => any>'}</TableCell>
                <TableCell align="left">
                  List of functions to use for `$modifier` or for `$action`. It will be available for use in `model` definition.{' '}
                </TableCell>
              </TableRow>
              <TableRow hover tabIndex={-1}>
                <TableCell align="left">getFormState</TableCell>
                <TableCell align="left">{'React.MutableRefObject<(() => DefaultValues) | undefined>'}</TableCell>
                <TableCell align="left">
                  Get the actual state of the form for store it persistently if needed. Use useRef to create a reference and pass you can give it to JsonUI
                  component. Check the Storybook example how to use it.
                </TableCell>
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
