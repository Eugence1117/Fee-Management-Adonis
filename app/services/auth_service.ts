import User from '#models/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthService {
  constructor(protected ctx: HttpContext) {}

  async generateToken(email: string, password: string) {
    try {
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: 60 * 24 * 14, // 14 days expiration
      })

      return token
    } catch (error) {
      throw error
    }
  }
}
