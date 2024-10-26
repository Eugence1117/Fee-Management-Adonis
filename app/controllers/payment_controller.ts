import PaymentService from '#services/payment_service'
import { createPaymentValidator, editPaymentValidator } from '#validators/payment'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Filter } from '../../types/filter.js'
import { Populate } from '../../types/populate.js'

@inject()
export default class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async list({ request }: HttpContext) {
    const qs = request.qs()
    const pageNum = qs['page'] || 1
    const pageSize = qs['page_size'] || 50
    const filter = qs['filter'] as Filter | undefined
    const populate = qs['populate'] as Populate | undefined
    return (await this.paymentService.paginate(pageNum, pageSize, filter, populate)).serialize()
  }

  async get({ request, response }: HttpContext) {
    const id = request.param('id')
    const qs = request.qs()
    const populate = qs['populate'] as Populate | undefined

    const user = await this.paymentService.getById(id, populate)
    if (!user) {
      return response.status(404)
    }
    return {
      data: user,
    }
  }

  async edit({ request, response }: HttpContext) {
    const { params, ...payload } = await request.validateUsing(editPaymentValidator)
    await this.paymentService.editById({ ...payload, id: params.id })
    return response.status(204).send({
      message: 'Payment info updated.',
    })
  }

  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createPaymentValidator)
    await this.paymentService.create(payload)
    return response.status(201).send({
      message: 'Payment created.',
    })
  }
}
