import './app.less'

import { echo } from 'package-demo'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { DemoPage } from './pages/demo'
import { HomePage } from './pages/home'
import { SFormPage } from './pages/sform'

export const App = () => {
  useEffect(() => {
    echo()
    console.log('app demo')
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SFormPage />} />
      </Routes>
    </BrowserRouter>
  )
}
