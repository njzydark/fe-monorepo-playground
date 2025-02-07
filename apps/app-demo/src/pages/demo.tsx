import { Link } from 'react-router'
import { DemoTitle } from 'shared-demo'

import styles from './page.module.less'

export const DemoPage = () => {
  return (
    <div className={styles['page-wrapper']}>
      <DemoTitle>Demo Page</DemoTitle>
      <Link to="/">Home Page</Link>
    </div>
  )
}
