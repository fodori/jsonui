import React from 'react'
import ReactDOM from 'react-dom'
import { JsonUI } from './index'
import viewDef from './Example.json'

ReactDOM.render(
  <React.StrictMode>
    <JsonUI viewDef={viewDef} />
  </React.StrictMode>,
  document.getElementById('root')
)
