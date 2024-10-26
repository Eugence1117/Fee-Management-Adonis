import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { getAdminToken } from '../shared.js'

test.group('Student edit', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('Edit Student as admin', async ({ client }) => {
    const adminToken = await getAdminToken()
    const student = await UserFactory.apply('student').create()
    const response = await client
      .patch(`/students/${student.id}`)
      .json({
        fullName: 'Student Changed',
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(204)
  })

  test('Edit student with same email', async ({ client }) => {
    const student = await UserFactory.apply('student').create()
    let adminToken = await getAdminToken()
    const response = await client
      .patch(`/students/${student.id}`)
      .json({
        email: student.email,
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(204)
  })

  test('Edit student with invalid payload', async ({ client }) => {
    const adminToken = await getAdminToken()
    const student = await UserFactory.apply('student').create()
    const response = await client
      .patch(`/students/${student.id}`)
      .json({
        email: 'studentB',
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(400)
  })

  test('Edit student without login', async ({ client }) => {
    const student = await UserFactory.apply('student').create()
    const response = await client.patch(`/students/${student.id}`).json({
      fullName: 'Student Changed',
    })

    response.assertStatus(401)
  })

  test('Edit student to a duplicate email', async ({ client }) => {
    const studentA = await UserFactory.apply('student').create()
    const studentB = await UserFactory.apply('student').create()
    let adminToken = await getAdminToken()
    const response = await client
      .patch(`/students/${studentA.id}`)
      .json({
        email: studentB.email,
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(400)
  })

  test('Edit student with student credential', async ({ client }) => {
    const student = await UserFactory.apply('student').create()
    const token = await User.accessTokens.create(student, ['*'], {
      expiresIn: 60 * 24 * 14, // 14 days expiration
    })

    const response = await client
      .patch(`/students/${student.id}`)
      .json({
        fullName: 'Student Changed',
      })
      .bearerToken(token.value!.release())

    response.assertStatus(403)
  })
})
