import Fee from '#models/fee'
import Payment from '#models/payment'

export type CreatePaymentPayload = {
  amount: number
  feeId: Fee['id']
}

export type EditPaymentPayload = { id: Payment['id'] } & Partial<{
  status: Payment['status']
  amount: number
  feeId: Fee['id']
}>

// export type UpdatePaymentStatusPayload = { id: Payment['id'] } & Partial<{
//   status: 'COMPLETED' | 'IN_PROGRESS' | 'CANCELLED'
// }>
