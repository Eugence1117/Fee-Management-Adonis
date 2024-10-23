import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import { type HttpContext } from '@adonisjs/core/http'
import { Filter } from '../../types/filter.js'
import { Populate } from '../../types/populate.js'
import { ErrorHandler } from '../../utils/errorHandler.js'

@inject()
export default class UsersController {
  constructor(private userService: UserService) {}

  async list({ request }: HttpContext) {
    const qs = request.qs()
    const pageNum = qs['page'] || 1
    const pageSize = qs['page_size'] || 50
    const filter = qs['filter'] as Filter | undefined
    const populate = qs['populate'] as Populate | undefined
    return (await this.userService.paginate(pageNum, pageSize, filter, populate)).serialize()
  }

  async get({ request, response }: HttpContext) {
    const id = request.param('id')
    const qs = request.qs()
    const populate = qs['populate'] as Populate | undefined

    const user = await this.userService.getUserById(id, populate)
    if (!user) {
      return response.status(404)
    }
    return {
      data: user,
    }
  }

  async edit({ request, response }: HttpContext) {
    try {
      const id = request.param('id')
      const body = request.body()
      await this.userService.edit({
        id,
        ...body,
      })
      return response.status(204).send({
        message: 'User info updated.',
      })
    } catch (error) {
      const handler = new ErrorHandler(error)
      const res = handler.toResponse()
      return response.status(res.status).send({
        message: res.message ?? '',
      })
    }
  }
}
