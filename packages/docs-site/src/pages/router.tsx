import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainPage from './homepage/Homepage'
import AllInOnePage from './allInOneExample/AllInOne'
import ApiJsonPage from './api-json/ApiJson'
import ApiReactPage from './api-react/ApiReact'
import GettingStartedPage from './getting-started/GettingStarted'
import TryPage from './try/Try'
import Layout from './Layout'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="try" element={<TryPage />} />
        <Route path="api-json" element={<ApiJsonPage />} />
        <Route path="api-react" element={<ApiReactPage />} />
        <Route path="getting-started" element={<GettingStartedPage />} />
        <Route path="example" element={<AllInOnePage />} />
        <Route path="*" element={<MainPage />} />
      </Route>
    </Routes>
  )
}

export default Router
