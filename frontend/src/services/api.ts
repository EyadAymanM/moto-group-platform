import type { Brand, Motorcycle, TestRideRequest, User, CmsSettings } from '../types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getCsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

let csrfFetched = false

export async function ensureCsrf(force = false): Promise<void> {
  if (!force && csrfFetched && getCsrfTokenFromCookie()) return
  try {
    await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
    })
    csrfFetched = true
  } catch (err) {
    console.warn('Could not fetch CSRF cookie:', err)
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  }

  // If sending JSON body, attach Content-Type and CSRF token
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const csrfToken = getCsrfTokenFromCookie()
  if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method?.toUpperCase() || '')) {
    headers['X-XSRF-TOKEN'] = csrfToken
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  })

  // Auto-Healing: If HTTP 419 (CSRF token mismatch), refresh CSRF token and retry once transparently
  if (response.status === 419 && !isRetry) {
    console.warn('[API] CSRF token mismatch (419). Auto-healing session and retrying request...')
    await ensureCsrf(true)
    return request<T>(endpoint, options, true)
  }

  if (!response.ok) {
    let errorData: any
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: response.statusText }
    }
    const error = new Error(errorData.message || 'API Request Failed')
    ;(error as any).status = response.status
    ;(error as any).errors = errorData.errors
    throw error
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

export const api = {
  // Public Catalog & Data
  getBrands: async (): Promise<Brand[]> => {
    const res = await request<Brand[] | { data: Brand[] }>('/api/brands')
    return Array.isArray(res) ? res : (res as any)?.data || []
  },
  
  getMotorcycles: async (params?: { category?: string; brand_id?: number; search?: string }): Promise<Motorcycle[]> => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.brand_id) searchParams.set('brand_id', params.brand_id.toString())
    if (params?.search) searchParams.set('search', params.search)
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ''
    const res = await request<Motorcycle[] | { data: Motorcycle[] }>(`/api/motorcycles${queryString}`)
    return Array.isArray(res) ? res : (res as any)?.data || []
  },

  getMotorcycle: async (idOrSlug: string | number): Promise<Motorcycle> => {
    const res = await request<Motorcycle | { data: Motorcycle }>(`/api/motorcycles/${idOrSlug}`)
    return (res as any)?.data || res
  },

  submitTestRide: async (data: Partial<TestRideRequest>) => {
    await ensureCsrf()
    return request<{ message: string; booking_id?: number }>('/api/test-rides', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getCmsSettings: () => request<CmsSettings>('/api/cms/settings'),

  // Authentication with robust session recovery
  login: async (credentials: { email: string; password: string }) => {
    try {
      await ensureCsrf(true)
      return await request<{ message: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
    } catch (err) {
      csrfFetched = false
      throw err
    }
  },

  logout: async () => {
    await ensureCsrf()
    return request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    })
  },

  getUser: async (): Promise<User | null> => {
    try {
      const res = await request<{ user: User } | User>('/api/auth/user')
      return (res as any)?.user || (res as User) || null
    } catch (err: any) {
      if (err?.status === 401) {
        return null // Graceful unauthenticated guest
      }
      return null
    }
  },

  // Admin CMS & Catalog Management
  admin: {
    getMotorcycles: async (params?: { category?: string; brand_id?: number }): Promise<Motorcycle[]> => {
      const searchParams = new URLSearchParams()
      if (params?.category) searchParams.set('category', params.category)
      if (params?.brand_id) searchParams.set('brand_id', params.brand_id.toString())
      const q = searchParams.toString() ? `?${searchParams.toString()}` : ''
      const res = await request<Motorcycle[] | { data: Motorcycle[] }>(`/api/admin/motorcycles${q}`)
      return Array.isArray(res) ? res : (res as any)?.data || []
    },
    
    createMotorcycle: async (data: Partial<Motorcycle>) => {
      await ensureCsrf()
      return request<{ message: string; motorcycle: Motorcycle }>('/api/admin/motorcycles', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    updateMotorcycle: async (id: number, data: Partial<Motorcycle>) => {
      await ensureCsrf()
      return request<{ message: string; motorcycle: Motorcycle }>(`/api/admin/motorcycles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    deleteMotorcycle: async (id: number) => {
      await ensureCsrf()
      return request<{ message: string }>(`/api/admin/motorcycles/${id}`, {
        method: 'DELETE',
      })
    },

    getTestRides: async (params?: { status?: string; city?: string; brand_id?: number }): Promise<TestRideRequest[]> => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set('status', params.status)
      if (params?.city) searchParams.set('city', params.city)
      if (params?.brand_id) searchParams.set('brand_id', params.brand_id.toString())
      const q = searchParams.toString() ? `?${searchParams.toString()}` : ''
      const res = await request<TestRideRequest[] | { data: TestRideRequest[] }>(`/api/admin/test-rides${q}`)
      return Array.isArray(res) ? res : (res as any)?.data || []
    },

    updateTestRideStatus: async (id: number, status: string, adminNotes?: string) => {
      await ensureCsrf()
      return request<{ message: string; data: TestRideRequest }>(`/api/admin/test-rides/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      })
    },

    updateCmsSettings: async (settings: Partial<CmsSettings>) => {
      await ensureCsrf()
      return request<{ message: string; settings: CmsSettings }>('/api/admin/cms/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      })
    },

    updateCmsSetting: async (key: string, value: any) => {
      await ensureCsrf()
      return request<{ message: string; setting: any }>(`/api/admin/cms/settings/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ value }),
      })
    },
  },
}
