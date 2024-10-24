import User from '#models/user'
import { inject } from '@adonisjs/core'
import { OPERATION_NOT_SUPPORT } from '../../constants/errors.js'
import { Filter } from '../../types/filter.js'
import { Populate } from '../../types/populate.js'
import { EditUserPayload } from '../../types/services/user_service.js'
import { buildQuery } from '../../utils/queryBuilder.js'

@inject()
export default class UserService {
  async paginate(
    page: number,
    size: number,
    filter: Filter | undefined = undefined,
    populate: Populate | undefined = undefined
  ) {
    const query = buildQuery(User.query(), populate, filter)
    const users = await query.paginate(page, size)
    return users
  }

  async getById(id: number, populate: Populate = '*') {
    const query = User.query()
    buildQuery(query, populate, [
      {
        field: 'id',
        operator: 'eq',
        value: id,
      },
    ])
    return await query.first()
  }

  async editById({
    id,
    ...fields
  }: Partial<EditUserPayload> & {
    id: number
  }) {
    const user = await User.findOrFail(id)
    // Only allow to edit student at this point, can be control via role based access
    if (user.role !== 'STUDENT') {
      throw new Error(OPERATION_NOT_SUPPORT)
    }
    await user.merge(fields).save()
  }
}
