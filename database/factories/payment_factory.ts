import Payment from '#models/payment'
import factory from '@adonisjs/lucid/factories'
import { FeeFactory } from './fee_factory.js'

export const PaymentFactory = factory
  .define(Payment, async () => {
    return {}
  })
  .relation('fee', () => FeeFactory)
  .state('completed', (payment) => (payment.status = 'COMPLETED'))
  .state('in-progress', (payment) => (payment.status = 'IN_PROGRESS'))
  .state('cancelled', (payment) => (payment.status = 'CANCELLED'))
  .state('eq-amount', (payment) => (payment.amount = payment.fee.amount))
  .state('neq-amount', (payment) => (payment.amount = payment.fee.amount - 1))
  .build()
