import { configApp } from '@adonisjs/eslint-config'
export default configApp({
  plugins: ['@adonisjs/eslint-plugin'],
  rules: {
    '@adonisjs/prefer-lazy-controller-import': 'error',
    '@adonisjs/prefer-lazy-listener-import': 'error',
  },
})
