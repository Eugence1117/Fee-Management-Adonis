import User, { UserRole } from '#models/user'
import factory from '@adonisjs/lucid/factories'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email(),
      fullName: faker.person.fullName(),
      password: faker.internet.password(),
    }
  })
  .state('admin', (u) => (u.role = UserRole.Admin))
  .state('student', (u) => (u.role = UserRole.Student))
  .build()
