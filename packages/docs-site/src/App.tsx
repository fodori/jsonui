import React from 'react'
import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import { HashRouter } from 'react-router-dom'
import Router from './pages/router'

/** Matches Vite `base` (see vite.config). Required for GitHub project pages under /<repo>/. */
function routerBasename(): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const base = import.meta.env.BASE_URL ?? '/'
  if (base === '/' || base === '') return undefined
  return base.endsWith('/') ? base.slice(0, -1) : base
}

function App() {
  return (
    <HashRouter basename={routerBasename()}>
      <CssBaseline />
      <Router />
    </HashRouter>
  )
}

export default App
