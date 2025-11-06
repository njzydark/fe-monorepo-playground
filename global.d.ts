/// <reference types="./packages/infra-tools/node_modules/@rstest/core/globals" />

declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.less' {
  const classes: { readonly [key: string]: string }
  export default classes
}
