import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import { type HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Fee from './fee.js'

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
  @hasOne(() => Fee)
  declare fee: HasOne<typeof Fee>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
