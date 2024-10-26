import { FeeFactory } from '#database/factories/fee_factory'
import { PaymentFactory } from '#database/factories/payment_factory'
import Payment from '#models/payment'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { getAdminToken } from '../shared.js'

test.group('Fee delete', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Only cover positive test due to time constraint
  test('Delete Fee as admin', async ({ client, assert }) => {
    const fee = await FeeFactory.apply('unpaid').create()
    const payment = await PaymentFactory.merge({
      feeId: fee.id,
      amount: fee.amount,
    }).createMany(4)
    let adminToken = await getAdminToken()
    const response = await client.delete(`/fees/${fee.id}`).bearerToken(adminToken.value!.release())

    response.assertStatus(200)
    const deletedPayments = await Payment.query().where('feeId', fee.id).whereNotNull('deletedAt')
    await fee.refresh()
    assert.notEqual(null, fee.deletedAt)
    assert.equal(payment.length, deletedPayments.length)
  })
})
