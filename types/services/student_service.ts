export type EditStudentPayload = {
  id: number
  fullName: string | null
  email: string
  password: string
}

export type CreateStudentPayload = {
  fullName: string | null
  email: string
  password: string
}
