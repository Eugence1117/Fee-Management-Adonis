import { FeeFactory } from '#database/factories/fee_factory'
import { PaymentFactory } from '#database/factories/payment_factory'
import { FeeStatus } from '#models/fee'
import { PaymentStatus } from '#models/payment'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { getAdminToken } from '../shared.js'

test.group('Payment edit', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Only cover positive test due to time constraint
  test('Update payment to completed', async ({ client, assert }) => {
    const fee = await FeeFactory.apply('unpaid').create()
    const payment = await PaymentFactory.merge({
      feeId: fee.id,
      amount: fee.amount,
    }).create()
    let adminToken = await getAdminToken()
    const response = await client
      .patch(`/payments/${payment.id}`)
      .json({
        status: PaymentStatus.Completed,
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(204)
    await fee.refresh()
    assert.equal(FeeStatus.Paid, fee.status)
  })

  test('Cancel duplicate payment', async ({ client, assert }) => {
    const fee = await FeeFactory.apply('paid').create()
    // First completed payment
    await PaymentFactory.merge({
      feeId: fee.id,
      amount: fee.amount,
    })
      .apply('completed')
      .create()

    const newPayment = await PaymentFactory.merge({
      feeId: fee.id,
      amount: fee.amount,
    })
      .apply('in-progress')
      .create()

    let adminToken = await getAdminToken()
    const response = await client
      .patch(`/payments/${newPayment.id}`)
      .json({
        status: PaymentStatus.Cancelled,
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(204)
    await fee.refresh()
    assert.equal(FeeStatus.Paid, fee.status)
  })

  test('Cancel invalid payment', async ({ client, assert }) => {
    const fee = await FeeFactory.apply('paid').create()
    // First completed payment
    const payment = await PaymentFactory.merge({
      feeId: fee.id,
      amount: fee.amount,
    })
      .apply('completed')
      .create()

    let adminToken = await getAdminToken()
    const response = await client
      .patch(`/payments/${payment.id}`)
      .json({
        status: PaymentStatus.Cancelled,
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(204)
    await fee.refresh()
    assert.equal(FeeStatus.Unpaid, fee.status)
  })
})
