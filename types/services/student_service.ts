export type EditUserPayload = {
  id: number
  fullName: string | null
  email: string
  role: 'ADMIN' | 'STUDENT'
  password: string
}
