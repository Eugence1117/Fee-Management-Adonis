import { adminCredential, studentCredential } from '#database/seeders/user_seeder'
import User from '#models/user'

export async function getAdminToken() {
  const admin = await User.verifyCredentials(adminCredential.email, adminCredential.password)
  const token = await User.accessTokens.create(admin, ['*'], {
    expiresIn: 60 * 24 * 14, // 14 days expiration
  })

  return token
}

export async function getStudentToken() {
  const student = await User.verifyCredentials(adminCredential.email, studentCredential.password)
  const studentToken = await User.accessTokens.create(student, ['*'], {
    expiresIn: 60 * 24 * 14, // 14 days expiration
  })
  return studentToken
}
