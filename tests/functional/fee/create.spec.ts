import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { getAdminToken } from '../shared.js'

test.group('Fee create', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Only cover positive test due to time constraint
  test('Create Fee as admin', async ({ client }) => {
    const student = await UserFactory.apply('student').create()
    let adminToken = await getAdminToken()
    const response = await client
      .post('/fees')
      .json({
        amount: 120,
        userId: student.id,
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(201)
  })
})
