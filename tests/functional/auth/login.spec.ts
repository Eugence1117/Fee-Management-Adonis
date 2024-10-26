import { adminCredential } from '#database/seeders/user_seeder'
import { test } from '@japa/runner'

// test.group('User', (group) => {
//   group.each.setup(() => testUtils.db().withGlobalTransaction())
// })

test.group('Auth login', async (group) => {
  // group.each.setup(() => {
  //   testUtils.db().truncate()
  // })

  test('Correct email & password', async ({ client }) => {
    const response = await client.post('/login').json(adminCredential)
    response.assertStatus(200)
  })

  test('Wrong email & password', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'invalid@mail.com',
      password: '123',
    })
    response.assertStatus(401)
  })

  test('Wrong password & correct email', async ({ client }) => {
    const response = await client.post('/login').json({
      email: adminCredential.email,
      password: '00000',
    })
    response.assertStatus(401)
  })

  test('Empty payload', async ({ client }) => {
    const response = await client.post('/login')
    response.assertStatus(400)
  })

  test('Invalid payload', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'this_is_my_email',
      password: '123',
    })
    response.assertStatus(400)
  })

  test('Use invalid REST method', async ({ client }) => {
    const response = await client.get('/login')
    response.assertStatus(404)
  })
})
