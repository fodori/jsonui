import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainPage from './homepage/Homepage'
import TryPage from './try/Try'
import ConceptPage from './concept/Concept'
import ApiJsonPage from './api-json/ApiJson'
import ApiReactPage from './api-react/ApiReact'
import GettingStartedPage from './getting-started/GettingStarted'
import Layout from './Layout'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="try" element={<TryPage />} />
        <Route path="concept" element={<ConceptPage />} />
        <Route path="api-json" element={<ApiJsonPage />} />
        <Route path="api-react" element={<ApiReactPage />} />
        <Route path="getting-started" element={<GettingStartedPage />} />
        <Route path="*" element={<MainPage />} />
      </Route>
    </Routes>
  )
}

export default Router
