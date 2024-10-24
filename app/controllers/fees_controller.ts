import FeeService from '#services/fee_service'
import { createFeeValidator, deleteFeeValidator, editFeeValidator } from '#validators/fees'
import { inject } from '@adonisjs/core'
import { type HttpContext } from '@adonisjs/core/http'
import { Filter } from '../../types/filter.js'
import { Populate } from '../../types/populate.js'
import { ErrorHandler } from '../../utils/errorHandler.js'

@inject()
export default class FeesController {
  constructor(private feeService: FeeService) {}

  async list({ request }: HttpContext) {
    const qs = request.qs()
    const pageNum = qs['page'] || 1
    const pageSize = qs['page_size'] || 50
    const filter = qs['filter'] as Filter | undefined
    const populate = qs['populate'] as Populate | undefined
    return (await this.feeService.paginate(pageNum, pageSize, filter, populate)).serialize()
  }

  async get({ request, response }: HttpContext) {
    const id = request.param('id')
    const qs = request.qs()
    const populate = qs['populate'] as Populate | undefined

    const user = await this.feeService.getById(id, populate)
    if (!user) {
      return response.status(404)
    }
    return {
      data: user,
    }
  }

  async edit({ request, response }: HttpContext) {
    try {
      const { params, ...payload } = await request.validateUsing(editFeeValidator)
      await this.feeService.editById({ ...payload, id: params.id })
      return response.status(204).send({
        message: 'Fee info updated.',
      })
    } catch (error) {
      const handler = new ErrorHandler(error)
      const { status, ...body } = handler.toResponseBody()
      return response.status(status).send(body)
    }
  }

  async delete({ request, response }: HttpContext) {
    try {
      const { params } = await request.validateUsing(deleteFeeValidator)
      await this.feeService.deleteById(params.id)
      return response.status(200).send({
        message: 'Fee removed.',
      })
    } catch (error) {
      const handler = new ErrorHandler(error)
      const { status, ...body } = handler.toResponseBody()
      return response.status(status).send(body)
    }
  }

  async create({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createFeeValidator)
      await this.feeService.create(payload)
      return response.status(201).send({
        message: 'Fee created.',
      })
    } catch (error) {
      const handler = new ErrorHandler(error)
      const { status, ...body } = handler.toResponseBody()
      return response.status(status).send(body)
    }
  }
}
