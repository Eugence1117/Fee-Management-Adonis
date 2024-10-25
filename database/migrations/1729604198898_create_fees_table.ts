import { FeeStatus } from '#models/fee'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.decimal('amount')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table
        .enu('status', [FeeStatus.Unpaid, FeeStatus.Paid, FeeStatus.Cancelled])
        .defaultTo(FeeStatus.Unpaid)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
