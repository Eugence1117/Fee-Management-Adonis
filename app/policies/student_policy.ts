import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import CustomBasePolicy from './custom_based_policy.js'

export default class StudentPolicy extends CustomBasePolicy {
  list(): AuthorizerResponse {
    return false
  }

  get(): AuthorizerResponse {
    return false
  }

  edit(): AuthorizerResponse {
    return false
  }

  create(): AuthorizerResponse {
    return false
  }
}
