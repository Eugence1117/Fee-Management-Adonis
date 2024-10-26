import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { type BelongsTo, type HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Payment from './payment.js'
import User from './user.js'

export enum FeeStatus {
  Paid = 'PAID',
  Unpaid = 'UNPAID',
  Cancelled = 'CANCELLED',
}
export default class Fee extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Details
  @column()
  declare amount: number

  @column()
  declare userId: number

  @column()
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  @column()
  declare status: FeeStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
