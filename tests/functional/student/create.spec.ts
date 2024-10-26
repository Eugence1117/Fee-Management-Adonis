import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { getAdminToken } from '../shared.js'

test.group('Student create', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('Create Student as admin', async ({ client }) => {
    let adminToken = await getAdminToken()
    const response = await client
      .post('/students')
      .json({
        fullName: 'Student B',
        email: 'studentB@email.com',
        password: 'student',
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(201)
  })

  test('Create student with duplicate email', async ({ client }) => {
    const nStudent = await UserFactory.apply('student').create()
    let adminToken = await getAdminToken()
    const response = await client
      .post('/students')
      .json({
        fullName: 'Student B',
        email: nStudent.email,
        password: 'student',
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(400)
  })

  test('Create student with invalid payload', async ({ client }) => {
    let adminToken = await getAdminToken()
    const response = await client
      .post('/students')
      .json({
        fullName: 'Student B',
        email: 'studentB',
        password: 'student',
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(400)
  })

  test('Create student without login', async ({ client }) => {
    const response = await client.post('/students').json({
      fullName: 'Student B',
      email: 'studentB',
      password: 'student',
    })

    response.assertStatus(401)
  })

  test('Create student with student credential', async ({ client }) => {
    const student = await UserFactory.apply('student').create()
    const token = await User.accessTokens.create(student, ['*'], {
      expiresIn: 60 * 24 * 14, // 14 days expiration
    })

    const response = await client
      .post('/students')
      .json({
        fullName: 'Student B',
        email: 'studentB@email.com',
        password: 'student',
      })
      .bearerToken(token.value!.release())

    response.assertStatus(403)
  })
})
