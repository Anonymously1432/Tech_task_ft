import { api } from './client'

export const authApi = {
  login: (email: string, password: string) =>
    api<{ accessToken: string; refreshToken: string; expiresIn: number; user: object }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
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
