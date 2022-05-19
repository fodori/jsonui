/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import JSONInput from 'react-json-editor-ajrm'
import { JsonUI } from '@jsonui/react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import locale from '../../react-json-editor-en'
import eee from './markdownExample.md'

function Try() {
  const [jsonVal, setJsonVal] = useState({
    $comp: 'Text',
    $children: 'Hello World',
    style: {
      textAlign: 'center',
      fontSize: 60,
    },
  })
  const [content, setContent] = useState('')

  useEffect(() => {
    fetch(eee)
      .then((res) => res.text())
      .then((md) => {
        setContent(md)
      })
  }, [])
  return (
    <>
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
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
    </>
  )
}

export default Try
