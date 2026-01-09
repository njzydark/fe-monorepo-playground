import { DemoBtn, DemoTitle } from 'demo-shared'
import { Link } from 'react-router'

import styles from './page.module.less'

export const HomePage = () => {
  return (
    <div className={styles['page-wrapper']}>
      <DemoTitle>Home Page</DemoTitle>
      <DemoBtn className="my-1 bg-pink-400">Demo Btn</DemoBtn>
      <Link to="/demo">Demo Page</Link>
    </div>
  )
}
