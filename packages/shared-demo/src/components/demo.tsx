import { ReactNode } from 'react'

type DemoProps = {
  children: ReactNode
  className?: string
}
export const DemoTitle = ({ children, className }: DemoProps) => {
  return <h1 className={`m-0 p-0 text-2xl font-bold ${className}`}>{children}</h1>
}

export const DemoBtn = ({ children, className }: DemoProps) => {
  return <div className={`cursor-pointer bg-blue-500 px-4 py-2 text-white ${className}`}>{children}</div>
}
