const API_BASE = '/api/v1'
const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  userData: 'userData',
}

function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.accessToken)
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (res.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      const newToken = localStorage.getItem(STORAGE_KEYS.accessToken)
      if (newToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`
        const retryRes = await fetch(`${API_BASE}${path}`, { ...options, headers })
        if (!retryRes.ok) throw new ApiError(retryRes.status, await retryRes.json().catch(() => ({})))
        return retryRes.json()
      }
    }
    throw new ApiError(401, { error: 'Unauthorized' })
  }
  if (!res.ok) {
    throw new ApiError(res.status, await res.json().catch(() => ({})))
  }
  return res.json()
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: { error?: string; details?: { field?: Record<string, string> } }
  ) {
    super(body.error || `HTTP ${status}`)
    this.name = 'ApiError'
  }
}

export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken)
  if (!refreshToken) return false
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return false
    const data = await res.json()
    localStorage.setItem(STORAGE_KEYS.accessToken, data.accessToken)
    return true
  } catch {
    return false
  }
}

export function setAuthData(accessToken: string, refreshToken: string, user: object) {
  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken)
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken)
  localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(user))
}

// Bug #2: при logout удалять только accessToken, оставлять refreshToken и userData
export function clearAuthData() {
  localStorage.removeItem(STORAGE_KEYS.accessToken)
  // НЕ удаляем refreshToken и userData — намеренный баг для тестирования
}

export function getStoredUser(): object | null {
  const raw = localStorage.getItem(STORAGE_KEYS.userData)
  return raw ? JSON.parse(raw) : null
}

export function hasValidToken(): boolean {
  return !!localStorage.getItem(STORAGE_KEYS.accessToken)
}
