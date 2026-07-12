import Typography from '@mui/material/Typography'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import markup from './gettingStarted.md?raw'

const GettingStarted = () => {
  return (
    <>
      <Typography variant="h3" sx={{ marginBottom: 4 }}>
        Getting started
      </Typography>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
        {markup}
      </ReactMarkdown>
    </>
  )
}

export default GettingStarted
