/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const StudentsController = () => import('#controllers/student_controller')
const FeesController = () => import('#controllers/fee_controller')
const PaymentsController = () => import('#controllers/payment_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Auth
router.post('/login', [AuthController, 'login'])

// Student routes
router.get('/students', [StudentsController, 'list']).use([middleware.auth()])
router.get('/students/:id', [StudentsController, 'get']).use([middleware.auth()])
router.patch('/students/:id', [StudentsController, 'edit']).use([middleware.auth()])

// Fee routes
router.get('/fees', [FeesController, 'list']).use([middleware.auth()])
router.get('/fees/:id', [FeesController, 'get']).use([middleware.auth()])
router.post('/fees', [FeesController, 'create']).use([middleware.auth()])
router.patch('/fees/:id', [FeesController, 'edit']).use([middleware.auth()])
router.delete('/fees/:id', [FeesController, 'delete']).use([middleware.auth()])

// Payment routes
router.get('/payments', [PaymentsController, 'list']).use([middleware.auth()])
router.get('/payments/:id', [PaymentsController, 'get']).use([middleware.auth()])
router.post('/payments', [PaymentsController, 'create']).use([middleware.auth()])
router.patch('/payments/:id', [PaymentsController, 'edit']).use([middleware.auth()])
router.delete('/payments/:id', [PaymentsController, 'delete']).use([middleware.auth()])
