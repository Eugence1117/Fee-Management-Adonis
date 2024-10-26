import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { getAdminToken } from '../shared.js'

test.group('Student get', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('Get Student as admin', async ({ client }) => {
    const adminToken = await getAdminToken()
    const student = await UserFactory.apply('student').create()
    const response = await client
      .get(`/students/${student.id}`)

      .bearerToken(adminToken.value!.release())

    response.assertStatus(200)
  })

  test('Get student with invalid ID', async ({ client }) => {
    const adminToken = await getAdminToken()
    const response = await client
      .get(`/students/1000`)

      .bearerToken(adminToken.value!.release())

    response.assertStatus(404)
  })

  test('Get student without login', async ({ client }) => {
    const student = await UserFactory.apply('student').create()
    const response = await client.get(`/students/${student.id}`)

    response.assertStatus(401)
  })

  test('Get student with student credential', async ({ client }) => {
    const student = await UserFactory.apply('student').create()
    const token = await User.accessTokens.create(student, ['*'], {
      expiresIn: 60 * 24 * 14, // 14 days expiration
    })

    const response = await client
      .get(`/students/${student.id}`)

      .bearerToken(token.value!.release())

    response.assertStatus(403)
  })
})
