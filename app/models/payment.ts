import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import { type HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Fee from './fee.js'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare amount: number

  @column()
  declare status: 'COMPLETED' | 'IN_PROGRESS' | 'CANCELLED'

  @column()
  @hasOne(() => Fee)
  declare fee: HasOne<typeof Fee>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
