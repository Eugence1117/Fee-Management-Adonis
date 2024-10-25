import { PaymentStatus } from '#models/payment'
import vine from '@vinejs/vine'

export const createPaymentValidator = vine.compile(
  vine.object({
    amount: vine.number(),
    feeId: vine.number(),
  })
)

export const editPaymentValidator = vine.compile(
  vine.object({
    status: vine
      .enum([
        PaymentStatus.Pending,
        PaymentStatus.InProgress,
        PaymentStatus.Cancelled,
        PaymentStatus.Completed,
      ])
      .optional(),
    amount: vine.number().optional(),
    feeId: vine.number().optional(),
    params: vine.object({ id: vine.number() }),
  })
)

export const updatePaymentStatusValidator = vine.compile(
  vine.object({
    status: vine
      .enum([PaymentStatus.InProgress, PaymentStatus.Completed, PaymentStatus.Cancelled])
      .optional(),
    params: vine.object({ id: vine.number() }),
  })
)

export const deletePaymentValidator = vine.compile(
  vine.object({
    params: vine.object({ id: vine.number() }),
  })
)
