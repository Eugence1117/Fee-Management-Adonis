import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import QueryString from 'qs'
import { getAdminToken } from '../shared.js'

test.group('Students list', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('Get Student List as admin', async ({ client, assert }) => {
    const adminToken = await getAdminToken()
    await UserFactory.apply('student').createMany(5)
    await UserFactory.apply('admin').create()

    const response = await client.get('/students').bearerToken(adminToken.value!.release())

    const body = response.body()
    response.assertStatus(200)
    // Total 6 length (Seeder + new data)
    assert.equal(5 + 1, (body?.data || []).length)
  })

  test('Get Student List with custom pagination', async ({ client, assert }) => {
    // Seeder has one record
    const adminToken = await getAdminToken()
    await UserFactory.apply('student').createMany(5)
    await UserFactory.apply('admin').create()

    const response = await client
      .get(
        '/students?' +
          new URLSearchParams({
            page: '1',
            page_size: '2',
          })
      )
      .bearerToken(adminToken.value!.release())

    const body = response.body()
    response.assertStatus(200)
    // Total 6 length (Seeder + new data)
    assert.equal(2, (body?.data || []).length)
  })

  test('Get Student List with custom filter', async ({ client, assert }) => {
    // Seeder has one record
    const adminToken = await getAdminToken()
    const students = await UserFactory.apply('student').createMany(2)

    const response = await client
      .get(
        '/students?' +
          new URLSearchParams(
            QueryString.stringify({
              filter: [
                {
                  field: 'email',
                  value: students[0].email,
                  operator: 'eq',
                  $and: {
                    field: 'fullName',
                    value: students[0].fullName,
                    operator: 'eq',
                  },
                },
              ],
            })
          )
      )
      .bearerToken(adminToken.value!.release())

    const body = response.body()
    response.assertStatus(200)
    // Total 6 length (Seeder + new data)
    assert.equal(1, (body?.data || []).length)
  })

  test('Get Student List with custom populate field', async ({ client, assert }) => {
    const adminToken = await getAdminToken()
    const student = await UserFactory.apply('student').create()

    const response = await client
      .get(
        '/students?' +
          new URLSearchParams(
            QueryString.stringify({
              populate: ['email'],
              filter: [
                {
                  field: 'email',
                  value: student.email,
                  operator: 'eq',
                },
              ],
            })
          )
      )
      .bearerToken(adminToken.value!.release())

    const body = response.body()
    response.assertStatus(200)
    // Total 6 length (Seeder + new data)
    assert.deepEqual(
      {
        email: student.email,
      },
      (body?.data || [])[0]
    )
  })

  test('Get Student List without login', async ({ client }) => {
    const response = await client.get(`/students`)

    response.assertStatus(401)
  })

  test('Get Student List with student credential', async ({ client }) => {
    const student = await UserFactory.apply('student').create()
    const token = await User.accessTokens.create(student, ['*'], {
      expiresIn: 60 * 24 * 14, // 14 days expiration
    })

    const response = await client
      .get(`/students`)

      .bearerToken(token.value!.release())

    response.assertStatus(403)
  })
})
