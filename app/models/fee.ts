import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { type BelongsTo, type HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'

export default class Fee extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Details
  @column()
  declare amount: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare status: 'PAID' | 'UNPAID' | 'CANCELLED'
  // Meta
  @column()
  declare createdBy: HasOne<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
