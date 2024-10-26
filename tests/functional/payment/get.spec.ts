import { PaymentFactory } from '#database/factories/payment_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import QueryString from 'qs'
import { getAdminToken } from '../shared.js'

test.group('Payment get', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Only cover positive test due to time constraint
  test('Get Payment as admin', async ({ client }) => {
    const payment = await PaymentFactory.with('fee', 1, (f) => f.apply('unpaid')).create()
    let adminToken = await getAdminToken()
    const response = await client
      .get(`/payments/${payment.id}`)
      .bearerToken(adminToken.value!.release())

    response.assertStatus(200)
  })

  test('Get Payment with custom populate', async ({ client, assert }) => {
    const payment = await PaymentFactory.with('fee', 1, (f) => f.apply('unpaid')).create()
    let adminToken = await getAdminToken()
    const response = await client
      .get(
        `/payments/${payment.id}?` +
          new URLSearchParams(
            QueryString.stringify({
              populate: ['feeId', 'amount'],
            })
          )
      )
      .bearerToken(adminToken.value!.release())

    response.assertStatus(200)
    const body = response.body()
    assert.deepEqual(['feeId', 'amount'], Object.keys(body?.data || {}))
  })
})
