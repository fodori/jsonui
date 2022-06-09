import React from 'react'
import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import Router from './pages/router'

function App() {
  return (
    <BrowserRouter basename="/jsonui/">
      <CssBaseline />
      <Router />
    </BrowserRouter>
  )
}

export default App
