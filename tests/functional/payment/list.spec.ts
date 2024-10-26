import { PaymentFactory } from '#database/factories/payment_factory'
import { PaymentStatus } from '#models/payment'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import QueryString from 'qs'
import { getAdminToken } from '../shared.js'

test.group('Payment list', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Only cover positive test due to time constraint
  test('Get Payment List as admin', async ({ client, assert }) => {
    const adminToken = await getAdminToken()
    await PaymentFactory.with('fee', 1, (f) => f.apply('unpaid'))
      .apply('cancelled')
      .createMany(5)

    const response = await client.get('/payments').bearerToken(adminToken.value!.release())

    const body = response.body()
    response.assertStatus(200)
    assert.equal(5, (body?.data || []).length)
  })

  test('Get Payment List with custom pagination', async ({ client, assert }) => {
    // Seeder has one record
    const adminToken = await getAdminToken()
    await PaymentFactory.with('fee', 1, (f) => f.apply('unpaid'))
      .apply('cancelled')
      .createMany(5)

    const response = await client
      .get(
        '/payments?' +
          new URLSearchParams({
            page: '1',
            page_size: '2',
          })
      )
      .bearerToken(adminToken.value!.release())

    const body = response.body()
    response.assertStatus(200)
    assert.equal(2, (body?.data || []).length)
  })

  test('Get Payment List with custom filter', async ({ client, assert }) => {
    // Seeder has one record
    const adminToken = await getAdminToken()
    await PaymentFactory.with('fee', 1, (f) => f.apply('unpaid'))
      .apply('cancelled')
      .merge({
        amount: 99,
      })

      .createMany(5)
    await PaymentFactory.with('fee', 1, (f) => f.apply('unpaid'))
      .apply('cancelled')
      .merge({
        amount: 250,
      })

      .createMany(5)

    const response = await client
      .get(
        '/payments?' +
          new URLSearchParams(
            QueryString.stringify({
              filter: [
                {
                  field: 'status',
                  value: PaymentStatus.Cancelled,
                  operator: 'eq',
                  $and: {
                    field: 'amount',
                    value: 99,
                    operator: 'gt',
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
    assert.equal(5, (body?.data || []).length)
  })

  test('Get Payment List with custom populate field', async ({ client, assert }) => {
    await PaymentFactory.with('fee', 1, (f) => f.apply('unpaid')).create()
    let adminToken = await getAdminToken()
    const response = await client
      .get(
        `/payments?` +
          new URLSearchParams(
            QueryString.stringify({
              populate: ['feeId', 'amount'],
            })
          )
      )
      .bearerToken(adminToken.value!.release())

    response.assertStatus(200)
    const body = response.body()
    const firstObj = (body?.data || [])[0]
    assert.deepEqual(['feeId', 'amount'], Object.keys(firstObj || {}))
  })
})
