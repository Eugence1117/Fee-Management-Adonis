import vine from '@vinejs/vine'

export const editUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().optional(),
    email: vine.string().trim().email().optional(),
    role: vine.enum(['ADMIN', 'STUDENT']).optional(),
    password: vine.string().optional(),
    params: vine.object({ id: vine.number() }),
  })
)
