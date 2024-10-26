import vine from '@vinejs/vine'

export const editStudentValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().optional(),
    email: vine.string().trim().email().optional(),
    password: vine.string().optional(),
    params: vine.object({ id: vine.number() }),
  })
)

export const createStudentValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim(),
    email: vine.string().trim().email(),
    password: vine.string(),
  })
)
