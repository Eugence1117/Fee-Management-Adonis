import User, { UserRole } from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export function isStudent(cls: HttpContext | User) {
  if (cls instanceof HttpContext) {
    return cls.auth.user?.role === UserRole.Student
  } else {
    return cls.role === UserRole.Student
  }
}
