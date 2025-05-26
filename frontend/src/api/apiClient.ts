// types/axios.d.ts
import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    isPublic?: boolean
    _retry?: boolean
  }

  export interface InternalAxiosRequestConfig {
    isPublic?: boolean
    _retry?: boolean
  }
}

// axiosClient.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

// Base URL from your environment
const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Create the Axios instance
export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// === REQUEST INTERCEPTOR ===
axiosClient.interceptors.request.use(
  (config) => {
    const isPublic = config.isPublic ?? false

    // Don't attach token for public APIs
    if (isPublic) return config

    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error.message)
    return Promise.reject(error)
  },
)

// === RESPONSE INTERCEPTOR ===
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    console.error('🔥 Response Error:', error.message)

    const originalRequest = error.config
    const status = error?.response?.status

    // Handle 401 by trying refresh flow
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.isPublic
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          throw new Error('Refresh token not found.')
        }

        // Get new access token from /token endpoint
        const response = await axios.post(`${API_BASE_URL}identity/token`, {
          refreshToken,
        })

        const newAccessToken = response.data?.accessToken
        const newRefreshToken = response.data?.refreshToken

        if (newAccessToken) {
          // Store new tokens
          localStorage.setItem('accessToken', newAccessToken)
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken)
          }

          // Retry original request with new access token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          }

          // Convert InternalAxiosRequestConfig to AxiosRequestConfig for retry
          const retryConfig = {
            ...originalRequest,
            headers: originalRequest.headers,
          }

          return axiosClient(retryConfig)
        } else {
          throw new Error('Failed to refresh token')
        }
      } catch (refreshError) {
        console.error('🔁 Token Refresh Failed:', refreshError)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/'
        return Promise.reject(refreshError)
      }
    }

    // General error handler
    if (status) {
      const data = error.response?.data
      switch (status) {
        case 400:
          // @ts-ignore
          throw new Error(data?.message || 'Bad Request')
        case 403:
          console.error('Forbidden:', data)
          break
        case 404:
          // @ts-ignore
          throw new Error(data?.message || 'Resource not found')
        case 500:
          throw new Error('Server Error')
        default:
          console.error(`Unhandled API Error (Status ${status}):`, data)
      }
    } else if (error.request) {
      console.error('❌ No response received from server.')
    } else {
      console.error('❌ Request setup error:', error.message)
    }

    return Promise.reject(error)
  },
)
