import User, { UserRole } from '#models/user'
import StudentPolicy from '#policies/student_policy'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DUPLICATE_ENTRY, FORBIDDEN } from '../../constants/errors.js'
import { Filter } from '../../types/filter.js'
import { Populate } from '../../types/populate.js'
import { CreateStudentPayload, EditStudentPayload } from '../../types/services/student_service.js'
import { buildQuery } from '../../utils/queryBuilder.js'

@inject()
export default class StudentService {
  constructor(protected ctx: HttpContext) {}

  async paginate(
    page: number,
    size: number,
    filter: Filter | undefined = undefined,
    populate: Populate | undefined = undefined
  ) {
    if (await this.ctx.bouncer.with(StudentPolicy).denies('list')) {
      throw new Error(FORBIDDEN)
    }
    const query = buildQuery(User.query(), populate, filter)
    query.where('role', UserRole.Student)
    const users = await query.paginate(page, size)
    return users
  }

  async getById(id: number, populate: Populate = '*') {
    if (await this.ctx.bouncer.with(StudentPolicy).denies('get')) {
      throw new Error(FORBIDDEN)
    }
    const query = User.query()
    buildQuery(query, populate, [
      {
        field: 'id',
        operator: 'eq',
        value: id,
      },
    ])
    query.where('role', UserRole.Student)
    return await query.first()
  }

  async editById({
    id,
    ...fields
  }: Partial<EditStudentPayload> & {
    id: number
  }) {
    if (await this.ctx.bouncer.with(StudentPolicy).denies('edit')) {
      throw new Error(FORBIDDEN)
    }
    if (fields.email) {
      // Check for duplicate entry
      const user = await User.query().where('email', fields.email).whereNot('id', id).first()
      if (user) {
        throw new Error(DUPLICATE_ENTRY)
      }
    }
    const student = await User.query().where('role', UserRole.Student).where('id', id).firstOrFail()
    await student.merge(fields).save()
  }

  async create(payload: CreateStudentPayload) {
    if (await this.ctx.bouncer.with(StudentPolicy).denies('create')) {
      throw new Error(FORBIDDEN)
    }

    // Check for duplicate entry
    const user = await User.query().where('email', payload.email).first()
    if (user) {
      throw new Error(DUPLICATE_ENTRY)
    }
    const student = await User.create({
      ...payload,
      role: UserRole.Student,
    })
    await student.save()
  }
}
