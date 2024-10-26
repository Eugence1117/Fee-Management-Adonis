import { afterSave, BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Fee, { FeeStatus } from './fee.js'

export enum PaymentStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Cancelled = 'CANCELLED',
}
export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare amount: number

  @column()
  declare status: PaymentStatus

  @column()
  declare feeId: number

  @column()
  @belongsTo(() => Fee)
  declare fee: BelongsTo<typeof Fee>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @afterSave()
  static async updateFeeStatus(payment: Payment) {
    const fee = await Fee.findOrFail(payment.feeId)
    if (payment.status === PaymentStatus.Completed) {
      fee.status = FeeStatus.Paid
      await fee.save()
      return
    }

    if (payment.status === PaymentStatus.Cancelled) {
      const completePayment = await Payment.query()
        .where('feeId', fee.id)
        .where('status', PaymentStatus.Completed)
        .first()
      // Remain the fee as paid if there is already a completed payment
      // Use case: Reject duplicate payment
      if (completePayment !== null) {
        fee.status = FeeStatus.Paid
        await fee.save()
      }
      // Change the fee back to unpaid is payment getting cancelled from complete status
      // Use case: Reject invalid payment
      else {
        fee.status = FeeStatus.Unpaid
        await fee.save()
      }
      return
    }
  }
}
