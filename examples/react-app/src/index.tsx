import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

import { router } from './routes'

import './styles.less'

const appId = 'app'
document.body.innerHTML = `<div id="${appId}"></div>`

const root = createRoot(document.getElementById(appId)!)
root.render(<RouterProvider router={router} />)
