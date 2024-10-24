import Fee from '#models/fee'
import User from '#models/user'

export type CreateFeePayload = {
  amount: number
  userId: User['id']
}

export type EditFeePayload = { id: Fee['id'] } & Partial<{
  status: 'PAID' | 'UNPAID' | 'CANCELLED'
  amount: number
  userId: User['id']
}>
