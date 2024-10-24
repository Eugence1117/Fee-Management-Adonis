import Fee from '#models/fee'
import Payment from '#models/payment'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { Filter } from '../../types/filter.js'
import { Populate } from '../../types/populate.js'
import { CreateFeePayload, EditFeePayload } from '../../types/services/fee_service.js'
import { buildQuery } from '../../utils/queryBuilder.js'

@inject()
export default class FeeService {
  async paginate(
    page: number,
    size: number,
    filter: Filter | undefined = undefined,
    populate: Populate | undefined = undefined
  ) {
    const query = buildQuery(Fee.query(), populate, filter)
    query.whereNull('deletedAt')
    const fees = await query.paginate(page, size)
    return fees
  }

  async getById(id: number, populate: Populate = '*') {
    const query = Fee.query()
    buildQuery(query, populate, [
      {
        field: 'id',
        operator: 'eq',
        value: id,
      },
    ])
    query.whereNull('deletedAt')
    return await query.first()
  }

  async editById({
    id,
    ...fields
  }: Partial<EditFeePayload> & {
    id: number
  }) {
    const fee = await Fee.findOrFail(id)
    // Only allow to edit student at this point, can be control via role based access
    await fee.merge(fields).save()
  }

  async deleteById(id: number) {
    const trx = await db.transaction()
    try {
      const fee = await Fee.findOrFail(id)
      if (fee.deletedAt !== null) {
        return
      }

      await trx.modelQuery(Payment).where('fee_id', fee.id).update({
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
    const user = await User.findOrFail(payload.userId)
    const fee = await user.related('fees').create({
      amount: payload.amount,
    })
    await fee.save()
  }
}
