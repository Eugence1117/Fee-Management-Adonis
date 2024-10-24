import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'eugencelim@gmail.com',
        password: 'eugence',
        fullName: 'Eugence',
        role: 'ADMIN',
      },
      {
        email: 'student@gmail.com',
        password: 'student',
        fullName: 'Student A',
        role: 'STUDENT',
      },
    ])
    // Write your database queries inside the run method
  }
}
