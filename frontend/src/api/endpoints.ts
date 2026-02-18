import { api } from './client'
import type { FormField, Product } from '../types'

export const authApi = {
  login: (email: string, password: string) =>
    api<{ accessToken: string; refreshToken: string; expiresIn: number; user: object }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
  register: (data: { email: string; password: string; fullName: string; phone: string; birthDate: string }) =>
    api<{ id: number; email: string; fullName: string }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  logout: (refreshToken: string) =>
    api<{ message: string }>(
      '/auth/logout',
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }
    ),
}

export const productsApi = {
  getAll: () =>
    api<{ products: Product[] }>('/products'),
  getByType: (type: string) =>
    api<{
      products: Product[]
      formFields: FormField[]
    }>(`/products/${type}`),
}

export const applicationsApi = {
  get: (params?: { status?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams()
    if (params?.status) q.set('status', params.status)
    if (params?.page) q.set('page', String(params.page))
    if (params?.limit) q.set('limit', String(params.limit))
    const query = q.toString()
    return api<{ applications: object[]; pagination: { page: number; limit: number; total: number } }>(
      `/applications${query ? `?${query}` : ''}`
    )
  },
  getById: (id: number) =>
    api<{ id: number; productType: string; status: string; data: object; calculatedPrice: number; createdAt: string; statusHistory: object[] }>(
      `/applications/${id}`
    ),
  create: (productType: string, productId: number, managerId: number, data: object) =>
    api<{ id: number; status: string; productType: string; calculatedPrice: number; createdAt: string }>(
      '/applications',
      {
        method: 'POST',
        body: JSON.stringify({ productType, productId, managerId, data: JSON.stringify(data) }),
      }
    ),
}

export const policiesApi = {
  get: (params?: { status?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams()
    if (params?.status) q.set('status', params.status)
    if (params?.page) q.set('page', String(params.page))
    if (params?.limit) q.set('limit', String(params.limit))
    const query = q.toString()
    return api<{ policies: object[]; pagination: { page: number; limit: number; total: number } }>(
      `/policies${query ? `?${query}` : ''}`
    )
  },
}

export const usersApi = {
  getMe: () =>
    api<{ id: number; email: string; fullName: string; phone?: string; birthDate: string; address?: string; role: string }>(
      '/users/me'
    ),
  updateMe: (data: { fullName: string; email: string; address: string }) =>
    api<{ id: number; email: string; fullName: string; phone?: string; address?: string }>(
      '/users/me',
      { method: 'PUT', body: JSON.stringify(data) }
    ),
  getDashboard: () =>
    api<{ user: { fullName: string }; stats: { activePolicies: number; totalCoverage: number; pendingApplications: number }; recentActivity: object[] }>(
      '/users/dashboard'
    ),
}

export const managerApi = {
  getApplications: (params?: { status?: string; productType?: string; search?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams()
    if (params?.status) q.set('status', params.status)
    if (params?.productType) q.set('productType', params.productType)
    if (params?.search) q.set('search', params.search)
    if (params?.page) q.set('page', String(params.page))
    if (params?.limit) q.set('limit', String(params.limit))
    const query = q.toString()
    return api<{ applications: object[]; pagination: { page: number; limit: number; total: number } }>(
      `/manager/applications${query ? `?${query}` : ''}`
    )
  },
  getApplicationById: (id: number) =>
    api<{
      id: number
      client: { id: number; fullName: string; email: string; phone: string }
      productType: string
      status: string
      data: object
      calculatedPrice: number
      createdAt: string
      statusHistory: object[]
      comments: object[]
    }>(`/manager/applications/${id}`),
  updateStatus: (id: number, status: string, comment?: string, rejectionReason?: string) =>
    api<{ id: number; status: string; updatedAt: string }>(
      `/manager/applications/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, comment, rejectionReason }),
      }
    ),
  addComment: (id: number, comment: string) =>
    api<{ id: number; comment: string; createdAt: string; author: object }>(
      `/manager/applications/${id}/comments`,
      { method: 'POST', body: JSON.stringify({ comment }) }
    ),
  getStatistics: (period?: string) =>
    api<{ period: string; byType: Record<string, number>; byStatus?: Record<string, number>; conversion: { total: number; approved: number; rejected: number; rate?: number } }>(
      `/manager/statistics${period ? `?period=${period}` : ''}`
    ),
  getDashboard: () =>
    api<{
      stats: { newToday: number; underReview: number; approvedThisMonth: number; rejectedThisMonth: number }
      chartData: { date: string; new?: number; approved?: number; rejected?: number }[]
      recentApplications: object[]
    }>('/manager/dashboard'),
}
