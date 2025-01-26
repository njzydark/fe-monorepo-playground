import { Link } from 'react-router'

import styles from './page.module.less'

export const HomePage = () => {
  return (
    <div className={styles['page-wrapper']}>
      <h1>Home Page</h1>
      <Link to="/demo">Demo Page</Link>
    </div>
  )
}
