import React from 'react'
import ReactDOM from 'react-dom'
import { JsonUI } from './index'
import model from './Example.json'

ReactDOM.render(
  <React.StrictMode>
    <JsonUI model={model} />
  </React.StrictMode>,
  document.getElementById('root')
)
