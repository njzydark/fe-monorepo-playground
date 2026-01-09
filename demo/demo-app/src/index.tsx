import { createRoot } from 'react-dom/client'

import { App } from './app'

const appId = 'app'
document.body.innerHTML = `<div id="${appId}"></div>`

const root = createRoot(document.getElementById(appId)!)
root.render(<App />)
