import User from '#models/user'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import CustomBasePolicy from './custom_based_policy.js'

export default class FeePolicy extends CustomBasePolicy {
  create(): AuthorizerResponse {
    return false
  }

  list(user: User | null): AuthorizerResponse {
    return user !== null
  }

  get(user: User | null): AuthorizerResponse {
    return user !== null
  }

  edit(): AuthorizerResponse {
    return false
  }

  delete(): AuthorizerResponse {
    return false
  }
}
