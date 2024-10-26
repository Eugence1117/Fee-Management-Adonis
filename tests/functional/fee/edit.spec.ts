import { FeeFactory } from '#database/factories/fee_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { getAdminToken } from '../shared.js'

test.group('Fee edit', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Only cover positive test due to time constraint
  test('Edit Fee as admin', async ({ client, assert }) => {
    const fee = await FeeFactory.apply('unpaid').create()
    let adminToken = await getAdminToken()
    const response = await client
      .patch(`/fees/${fee.id}`)
      .json({
        amount: 99,
      })
      .bearerToken(adminToken.value!.release())

    response.assertStatus(204)
    await fee.refresh()
    assert.equal(99, fee.amount)
  })
})
