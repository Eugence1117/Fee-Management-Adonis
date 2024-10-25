import AuthService from '#services/auth_service'
import { loginValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(private service: AuthService) {}

  async login({ request, response }: HttpContext) {
    const { password, email } = await request.validateUsing(loginValidator)
    const token = await this.service.generateToken(email, password)
    return response.status(200).send({
      message: 'Login success',
      _meta: {
        token,
      },
    })
  }
}
