import './app.less'

import { echo } from 'package-demo'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { DemoPage } from './pages/demo'
import { HomePage } from './pages/home'

export const App = () => {
  useEffect(() => {
    echo()
    console.log('app demo')
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
      </Routes>
    </BrowserRouter>
  )
}
