import Fee from '#models/fee'
import Payment from '#models/payment'

export type CreatePaymentPayload = {
  feeId: Fee['id']
}

export type EditPaymentPayload = { id: Payment['id'] } & Partial<{
  status: Payment['status']
}>

// export type UpdatePaymentStatusPayload = { id: Payment['id'] } & Partial<{
//   status: 'COMPLETED' | 'IN_PROGRESS' | 'CANCELLED'
// }>
