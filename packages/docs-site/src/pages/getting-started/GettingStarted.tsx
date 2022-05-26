import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import markupFile from './gettingStarted.md'

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
        Getting started
      </Typography>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </>
  )
}

export default App
