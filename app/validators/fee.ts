import { FeeStatus } from '#models/fee'
import vine from '@vinejs/vine'

export const createFeeValidator = vine.compile(
  vine.object({
    amount: vine.number(),
    userId: vine.number(),
  })
)

export const editFeeValidator = vine.compile(
  vine.object({
    status: vine.enum([FeeStatus.Unpaid, FeeStatus.Paid, FeeStatus.Cancelled]).optional(),
    amount: vine.number().optional(),
    userId: vine.number().optional(),
    params: vine.object({ id: vine.number() }),
  })
)

export const deleteFeeValidator = vine.compile(
  vine.object({
    params: vine.object({ id: vine.number() }),
  })
)
