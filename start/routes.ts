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
const FeesController = () => import('#controllers/fees_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// User routes
router.get('/users', [UsersController, 'list'])
router.get('/users/:id', [UsersController, 'get'])
router.patch('/users/:id', [UsersController, 'edit'])

// Fee routes
router.get('/fees', [FeesController, 'list'])
router.get('/fees/:id', [FeesController, 'get'])
router.post('/fees', [FeesController, 'create'])
router.patch('/fees/:id', [FeesController, 'edit'])
router.delete('/fees/:id', [FeesController, 'delete'])

// Third party
// router.post("/webhooks",[])
