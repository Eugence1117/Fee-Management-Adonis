import { FeeFactory } from '#database/factories/fee_factory'
import { PaymentFactory } from '#database/factories/payment_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { getAdminToken } from '../shared.js'

test.group('Payment create', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Only cover positive test due to time constraint
  test('Create Payment', async ({ client }) => {
    const fee = await FeeFactory.apply('unpaid').create()

    let adminToken = await getAdminToken()
    const response = await client
      .post('/payments')
      .json({
        feeId: fee.id,
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(201)
  })

  test('Create Payment when other payment ongoing', async ({ client }) => {
    const fee = await FeeFactory.apply('unpaid').create()
    await PaymentFactory.merge({
      amount: fee.amount,
      feeId: fee.id,
    })
      .apply('in-progress')
      .create()

    let adminToken = await getAdminToken()
    const response = await client
      .post('/payments')
      .json({
        feeId: fee.id,
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(400)
  })
})
