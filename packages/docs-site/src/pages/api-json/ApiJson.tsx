import Typography from '@mui/material/Typography'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import markup from './apiJson.md?raw'

const ApiJson = () => {
  return (
    <>
      <Typography variant="h3" sx={{ marginBottom: 4 }}>
        Json API Reference
      </Typography>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
        {markup}
      </ReactMarkdown>
    </>
  )
}

export default ApiJson
