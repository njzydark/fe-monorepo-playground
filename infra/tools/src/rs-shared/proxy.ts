import type { ProxyOptions } from '@rsbuild/core'

export const commonProxy = (proxyTarget: string): ProxyOptions => {
  return {
    pathFilter: (pathname: string) => {
      return new RegExp('^/(?!@fs/)(?:.*/)?api/.*').test(pathname)
    },
    target: proxyTarget,
    secure: false,
    changeOrigin: true,
  }
}
