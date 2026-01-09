import { DemoTitle } from 'demo-shared'
import { Link } from 'react-router'

import styles from './page.module.less'

export const DemoPage = () => {
  return (
    <div className={styles['page-wrapper']}>
      <DemoTitle>Demo Page</DemoTitle>
      <Link to="/">Home Page</Link>
    </div>
  )
}
