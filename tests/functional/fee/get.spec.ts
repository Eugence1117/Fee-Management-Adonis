import { FeeFactory } from '#database/factories/fee_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import QueryString from 'qs'
import { getAdminToken } from '../shared.js'

test.group('Fee get', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Only cover positive test due to time constraint
  test('Get Fee as admin', async ({ client }) => {
    const fee = await FeeFactory.apply('unpaid').create()
    let adminToken = await getAdminToken()
    const response = await client.get(`/fees/${fee.id}`).bearerToken(adminToken.value!.release())

    response.assertStatus(200)
  })

  test('Get Fee with custom populate', async ({ client, assert }) => {
    const fee = await FeeFactory.merge({
      amount: 125.25,
    })
      .apply('unpaid')
      .create()
    let adminToken = await getAdminToken()
    const response = await client
      .get(
        `/fees/${fee.id}?` +
          new URLSearchParams(
            QueryString.stringify({
              populate: ['userId', 'amount'],
            })
          )
      )
      .bearerToken(adminToken.value!.release())

    response.assertStatus(200)
    const body = response.body()
    assert.deepEqual(['userId', 'amount'], Object.keys(body?.data || {}))
  })
})
