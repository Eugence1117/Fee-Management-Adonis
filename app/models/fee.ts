import { BaseModel, column } from '@adonisjs/lucid/orm'
import { type HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'

export default class Fee extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Details
  @column()
  declare amount: number

  @column()
  declare user: HasOne<typeof User>

  @column()
  declare status: 'PAID' | 'UNPAID' | 'CANCELLED'
  // Meta
  @column()
  declare createdBy: HasOne<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
