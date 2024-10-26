import Fee, { FeeStatus } from '#models/fee'
import Payment from '#models/payment'
import User from '#models/user'
import FeePolicy from '#policies/fee_policy'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { FORBIDDEN, OPERATION_NOT_SUPPORT } from '../../constants/errors.js'
import { Filter } from '../../types/filter.js'
import { Populate } from '../../types/populate.js'
import { CreateFeePayload, EditFeePayload } from '../../types/services/fee_service.js'
import { isStudent } from '../../utils/index.js'
import { buildQuery } from '../../utils/queryBuilder.js'

@inject()
export default class FeeService {
  constructor(protected ctx: HttpContext) {}

  async paginate(
    page: number,
    size: number,
    filter: Filter | undefined = undefined,
    populate: Populate | undefined = undefined,
    filterDeleted: boolean = true
  ) {
    if (await this.ctx.bouncer.with(FeePolicy).denies('list')) {
      throw new Error(FORBIDDEN)
    }
    let query = Fee.query()
    if (isStudent(this.ctx)) {
      query = Fee.query().where('userId', this.ctx.auth.user!.id)
    }
    buildQuery(query, populate, filter)
    if (filterDeleted) query.whereNull('deletedAt')

    const fees = await query.paginate(page, size)
    return fees
  }

  async getById(id: number, populate: Populate = '*', filterDeleted: boolean = true) {
    if (await this.ctx.bouncer.with(FeePolicy).denies('get')) {
      throw new Error(FORBIDDEN)
    }
    const query = Fee.query()
    buildQuery(query, populate, [
      {
        field: 'id',
        operator: 'eq',
        value: id,
      },
    ])
    if (filterDeleted) query.whereNull('deletedAt')
    return await query.firstOrFail()
  }

  async editById({
    id,
    ...fields
  }: Partial<EditFeePayload> & {
    id: number
  }) {
    if (await this.ctx.bouncer.with(FeePolicy).denies('edit')) {
      throw new Error(FORBIDDEN)
    }
    const fee = await Fee.query().whereNull('deletedAt').where('id', id).firstOrFail()
    if (fee.status === FeeStatus.Paid) {
      // Not allow to edit anymore once the object status cycle finished
      throw new Error(OPERATION_NOT_SUPPORT)
    }
    await fee.merge(fields).save()
  }

  async deleteById(id: number) {
    if (await this.ctx.bouncer.with(FeePolicy).denies('delete')) {
      throw new Error(FORBIDDEN)
    }
    const trx = await db.transaction()
    try {
      const fee = await Fee.query().whereNull('deletedAt').where('id', id).firstOrFail()
      if (fee.deletedAt !== null) {
        return
      }

      await trx.modelQuery(Payment).where('feeId', fee.id).update({
        deletedAt: DateTime.now().toISO(),
      })
      await trx.modelQuery(Fee).where('id', fee.id).update({
        deletedAt: DateTime.now().toISO(),
      })

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async create(payload: CreateFeePayload) {
    if (await this.ctx.bouncer.with(FeePolicy).denies('create')) {
      throw new Error(FORBIDDEN)
    }
    const user = await User.findOrFail(payload.userId)
    const fee = await user.related('fees').create({
      amount: payload.amount,
    })
    await fee.save()
  }
}
