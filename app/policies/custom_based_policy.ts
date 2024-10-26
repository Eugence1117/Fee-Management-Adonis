import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class CustomBasePolicy extends BasePolicy {
  async before(user: User | null) {
    if (user?.role === 'ADMIN') {
      //TODO implement role based management here
      return true
    }
    return undefined
  }
}
