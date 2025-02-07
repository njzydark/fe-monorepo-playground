import { sharedDemo } from 'shared-demo'

export const packageDemo = () => {
  console.log('package demo')
}

export const echo = () => {
  sharedDemo()
  packageDemo()
}
