import type { Brand, Motorcycle, TestRideRequest, User, CmsSettings } from '../types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getCsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

let csrfFetched = false

export async function ensureCsrf(): Promise<void> {
  if (csrfFetched && getCsrfTokenFromCookie()) return
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
  options: RequestInit = {}
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

  // Authentication
  login: async (credentials: { email: string; password: string }) => {
    await ensureCsrf()
    return request<{ message: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
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
    getMotorcycles: () => request<{ data: Motorcycle[] }>('/api/admin/motorcycles'),
    
    createMotorcycle: async (data: Partial<Motorcycle>) => {
      await ensureCsrf()
      return request<{ message: string; data: Motorcycle }>('/api/admin/motorcycles', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    updateMotorcycle: async (id: number, data: Partial<Motorcycle>) => {
      await ensureCsrf()
      return request<{ message: string; data: Motorcycle }>(`/api/admin/motorcycles/${id}`, {
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

    getTestRides: (status?: string) => {
      const q = status ? `?status=${status}` : ''
      return request<{ data: TestRideRequest[] }>(`/api/admin/test-rides${q}`)
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
  },
}
