/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// User routes
router.get('/users', [UsersController, 'list'])
router.get('/users/:id', [UsersController, 'get'])
router.patch('/users/:id', [UsersController, 'edit'])
