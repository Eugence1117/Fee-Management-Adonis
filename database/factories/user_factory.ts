import User from '#models/user'
import factory from '@adonisjs/lucid/factories'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email(),
      fullName: faker.person.fullName(),
      password: faker.internet.password(),
    }
  })
  .state('staff', (u) => (u.role = 'ADMIN'))
  .state('student', (u) => (u.role = 'STUDENT'))
  .build()
