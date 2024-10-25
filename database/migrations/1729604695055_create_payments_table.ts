import { PaymentStatus } from '#models/payment'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.decimal('amount')
      table.integer('fee_id').unsigned().references('fees.id').onDelete('CASCADE')
      table
        .enu('status', [
          PaymentStatus.Pending,
          PaymentStatus.InProgress,
          PaymentStatus.Completed,
          PaymentStatus.Cancelled,
        ])
        .defaultTo(PaymentStatus.Pending)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
