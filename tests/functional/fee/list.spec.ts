import { FeeFactory } from '#database/factories/fee_factory'
import { FeeStatus } from '#models/fee'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import QueryString from 'qs'
import { getAdminToken } from '../shared.js'

test.group('Fee list', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Only cover positive test due to time constraint
  test('Get Fee List as admin', async ({ client, assert }) => {
    const adminToken = await getAdminToken()
    await FeeFactory.apply('unpaid').createMany(5)

    const response = await client.get('/fees').bearerToken(adminToken.value!.release())

    const body = response.body()
    response.assertStatus(200)
    assert.equal(5, (body?.data || []).length)
  })

  test('Get Fee List with custom pagination', async ({ client, assert }) => {
    // Seeder has one record
    const adminToken = await getAdminToken()
    await FeeFactory.apply('unpaid').createMany(5)

    const response = await client
      .get(
        '/fees?' +
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

  test('Get Fee List with custom filter', async ({ client, assert }) => {
    // Seeder has one record
    const adminToken = await getAdminToken()
    await FeeFactory.merge({
      amount: 99,
    })
      .apply('unpaid')
      .createMany(5)
    await FeeFactory.merge({
      amount: 250,
    })
      .apply('unpaid')
      .createMany(5)

    const response = await client
      .get(
        '/fees?' +
          new URLSearchParams(
            QueryString.stringify({
              filter: [
                {
                  field: 'status',
                  value: FeeStatus.Unpaid,
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

  test('Get Fee List with custom populate field', async ({ client, assert }) => {
    await FeeFactory.apply('unpaid').create()
    let adminToken = await getAdminToken()
    const response = await client
      .get(
        `/fees?` +
          new URLSearchParams(
            QueryString.stringify({
              populate: ['userId', 'amount'],
            })
          )
      )
      .bearerToken(adminToken.value!.release())

    response.assertStatus(200)
    const body = response.body()
    const firstObj = (body?.data || [])[0]
    assert.deepEqual(['userId', 'amount'], Object.keys(firstObj || {}))
  })
})
