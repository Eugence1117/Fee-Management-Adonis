import Fee from '#models/fee'
import Payment from '#models/payment'
import User from '#models/user'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import CustomBasePolicy from './custom_based_policy.js'

export default class PaymentPolicy extends CustomBasePolicy {
  create(user: User | null, fee: Fee): AuthorizerResponse {
    return user !== null && fee.userId === user.id
  }

  list(user: User | null): AuthorizerResponse {
    return user !== null
  }

  get(user: User | null): AuthorizerResponse {
    return user !== null
  }

  edit(user: User | null, payment: Payment): AuthorizerResponse {
    return user?.id === payment.fee.userId
  }

  delete(): AuthorizerResponse {
    return false
  }
}
