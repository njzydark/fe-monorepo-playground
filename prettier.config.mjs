/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],

  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 120,
  semi: false,
  singleQuote: true,
  arrowParens: 'always',
}

export default config
