import React from 'react'
import ReactDOM from 'react-dom/client'
import { JsonUI } from './index'
import model from './Example.json'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JsonUI model={model} />
  </React.StrictMode>
)
