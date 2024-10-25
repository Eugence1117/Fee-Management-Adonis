import Fee from '#models/fee'
import Payment from '#models/payment'
import PaymentPolicy from '#policies/payment_policy'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { FORBIDDEN } from '../../constants/errors.js'
import { Filter } from '../../types/filter.js'
import { Populate } from '../../types/populate.js'
import { CreatePaymentPayload, EditPaymentPayload } from '../../types/services/payment_service.js'
import { isStudent } from '../../utils/index.js'
import { buildQuery } from '../../utils/queryBuilder.js'

@inject()
export default class PaymentService {
  constructor(protected ctx: HttpContext) {}

  async paginate(
    page: number,
    size: number,
    filter: Filter | undefined = undefined,
    populate: Populate | undefined = undefined,
    filterDeleted: boolean = true
  ) {
    if (await this.ctx.bouncer.with(PaymentPolicy).denies('list')) {
      throw new Error(FORBIDDEN)
    }
    let query = Payment.query()
    if (isStudent(this.ctx)) {
      query = Payment.query().whereHas('fee', (fee) => fee.where('userId', this.ctx.auth.user!.id))
    }
    buildQuery(query, populate, filter)
    if (filterDeleted) {
      query.whereNull('deletedAt')
    }

    const payment = await query.paginate(page, size)
    return payment
  }

  async getById(id: number, populate: Populate = '*', filterDeleted: boolean = true) {
    if (await this.ctx.bouncer.with(PaymentPolicy).denies('get')) {
      throw Error(FORBIDDEN)
    }
    const query = Payment.query()
    buildQuery(query, populate, [
      {
        field: 'id',
        operator: 'eq',
        value: id,
      },
    ])
    if (filterDeleted) {
      query.whereNull('deletedAt')
    }
    return await query.firstOrFail()
  }

  async editById({
    id,
    ...fields
  }: Partial<EditPaymentPayload> & {
    id: number
  }) {
    const payment = await Payment.query().whereNull('deletedAt').where('id', id).firstOrFail()
    if (await this.ctx.bouncer.with(PaymentPolicy).denies('edit', payment)) {
      throw new Error(FORBIDDEN)
    }
    await payment.merge(fields).save()
  }

  async deleteById(id: number) {
    if (await this.ctx.bouncer.with(PaymentPolicy).denies('delete')) {
      throw new Error(FORBIDDEN)
    }
    const payment = await Payment.query().whereNull('deletedAt').where('id', id).firstOrFail()
    payment.deletedAt = DateTime.now()
    await payment.save()
  }

  async create(payload: CreatePaymentPayload) {
    const fee = await Fee.findOrFail(payload.feeId)
    if (await this.ctx.bouncer.with(PaymentPolicy).denies('create', fee)) {
      throw new Error(FORBIDDEN)
    }
    const payment = await fee.related('payments').create({
      amount: payload.amount,
    })
    await payment.save()
  }
}
