export interface Product {
  id: number
  type: string
  name: string
  description: string
  basePrice: number
  icon?: string
}

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

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phone: string
  birthDate: string
}

export interface DashboardResponse {
  user: { fullName: string }
  stats: {
    activePolicies: number
    totalCoverage: number
    pendingApplications: number
  }
  recentActivity: ActivityEntry[]
}

export interface ActivityEntry {
  id: number
  type: string
  status: string
  productType: string
  createdAt: string
  calculatedPrice?: number
}

export interface Policy {
  id: number
  policyNumber: string
  productType: string
  status: string
  startDate: string
  endDate: string
  coverageAmount: number
  premium: number
}

export interface Application {
  id: number
  status: string
  productType: string
  calculatedPrice: number
  createdAt: string
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

export interface FormField {
  name: string
  type: string
  label: string
  required: boolean
  options?: string[]
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  minDate?: string
  after?: string
}
