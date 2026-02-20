export interface User {
  id: number
  email: string
  role: string
  fullName?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: User
}

export interface ManagerApplication {
  id: number
  client: { id: number; fullName: string; email: string }
  productType: string
  status: string
  calculatedPrice: number
  createdAt: string
}

export interface ManagerApplicationDetail extends ManagerApplication {
  client: { id: number; fullName: string; email: string; phone: string }
  data: Record<string, unknown>
  statusHistory: { oldStatus?: string; newStatus: string; comment?: string; createdAt: string }[]
  comments: { id: number; author: string; comment: string; createdAt: string }[]
}
