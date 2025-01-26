import { Link } from 'react-router'

import styles from './page.module.less'

export const DemoPage = () => {
  return (
    <div className={styles['page-wrapper']}>
      <h1>Demo Page</h1>
      <Link to="/">Home Page</Link>
    </div>
  )
}
