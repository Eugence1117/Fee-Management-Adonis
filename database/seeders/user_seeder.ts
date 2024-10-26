import User, { UserRole } from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export const adminCredential = {
  email: 'admin@email.com',
  password: 'admin',
}

export const studentCredential = {
  email: 'student@email.com',
  password: 'student',
}

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: adminCredential.email,
        password: adminCredential.password,
        fullName: 'Admin',
        role: UserRole.Admin,
      },
      {
        email: studentCredential.email,
        password: studentCredential.password,
        fullName: 'Student A',
        role: UserRole.Student,
      },
    ])
    // Write your database queries inside the run method
  }
}
