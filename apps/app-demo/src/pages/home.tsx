import { Link } from 'react-router'
import { DemoBtn, DemoTitle } from 'shared-demo'

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
