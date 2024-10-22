import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.double('amount', 2)
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.enu('status', ['PAID', 'UNPAID', 'CANCELLED'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
