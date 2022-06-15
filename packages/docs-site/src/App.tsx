import React from 'react'
import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import { HashRouter } from 'react-router-dom'
import Router from './pages/router'

function App() {
  return (
    <HashRouter>
      <CssBaseline />
      <Router />
    </HashRouter>
  )
}

export default App
