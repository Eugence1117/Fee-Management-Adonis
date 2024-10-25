import StudentService from '#services/student_service'
import { editUserValidator } from '#validators/student'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Filter } from '../../types/filter.js'
import { Populate } from '../../types/populate.js'

@inject()
export default class StudentController {
  constructor(private service: StudentService) {}

  async list({ auth, request }: HttpContext) {
    const qs = request.qs()
    const pageNum = qs['page'] || 1
    const pageSize = qs['page_size'] || 50
    const filter = qs['filter'] as Filter | undefined
    const populate = qs['populate'] as Populate | undefined
    return (await this.service.paginate(pageNum, pageSize, filter, populate)).serialize()
  }

  async get({ request, response }: HttpContext) {
    const id = request.param('id')
    const qs = request.qs()
    const populate = qs['populate'] as Populate | undefined

    const user = await this.service.getById(id, populate)
    if (!user) {
      return response.status(404)
    }
    return {
      data: user,
    }
  }

  async edit({ request, response }: HttpContext) {
    const { params, ...payload } = await request.validateUsing(editUserValidator)
    await this.service.editById({
      id: params.id,
      ...payload,
    })
    return response.status(204).send({
      message: 'User info updated.',
    })
  }
}
