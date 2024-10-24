import Fee from '#models/fee'
import factory from '@adonisjs/lucid/factories'
import { UserFactory } from './user_factory.js'

export const FeeFactory = factory
  .define(Fee, async ({ faker }) => {
    return {
      amount: faker.number.float({
        min: 1,
        fractionDigits: 2,
      }),
    }
  })
  .state('paid', (fee) => (fee.status = 'PAID'))
  .state('cancelled', (fee) => (fee.status = 'CANCELLED'))
  .state('unpaid', (fee) => (fee.status = 'UNPAID'))
  .relation('user', () => UserFactory.apply('student'))
  .relation('createdBy', () => UserFactory.apply('staff'))
  .build()