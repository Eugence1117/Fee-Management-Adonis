import Fee, { FeeStatus } from '#models/fee'
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
  .state('paid', (fee) => (fee.status = FeeStatus.Paid))
  .state('cancelled', (fee) => (fee.status = FeeStatus.Cancelled))
  .state('unpaid', (fee) => (fee.status = FeeStatus.Unpaid))
  .relation('user', () => UserFactory.apply('student'))
  .build()
