import { sharedDemo } from 'demo-shared'

export const packageDemo = () => {
  console.log('package demo')
}

export const echo = () => {
  sharedDemo()
  packageDemo()
}
