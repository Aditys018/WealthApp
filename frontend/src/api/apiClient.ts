// src/api/axiosClient.ts

import axios, { AxiosError } from 'axios'

import type { AxiosInstance, AxiosResponse } from 'axios'

// 3. You can also have `.env.development`, `.env.production` etc.
const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api' // Fallback for local development if .env isn't set

// --- Axios Instance Creation ---
// Create a custom Axios instance with predefined configurations.
// This allows you to centralize common settings like base URL, timeouts, and headers.
export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Request timeout in milliseconds (e.g., 15 seconds)
  headers: {
    'Content-Type': 'application/json', // Default content type for requests
    Accept: 'application/json', // What the client prefers to receive
    // 'X-Custom-Header': 'foobar' // Example of a custom default header
  },
})

// --- Request Interceptors ---
// Interceptors allow you to modify requests before they are sent to the server.
// Common uses: adding authentication tokens, logging requests, modifying request data.
axiosClient.interceptors.request.use(
  (config) => {
    // Example: Add an Authorization token from localStorage or a global state (e.g., Redux, Zustand)
    const token = localStorage.getItem('authToken') // Or from a global auth context/store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // You can also add other dynamic headers, or modify request data.
    // console.log('🚀 Request Interceptor:', config); // For debugging
    return config
  },
  (error: AxiosError) => {
    // Handle request errors (e.g., network issues, malformed requests)
    console.error('❌ Request Error:', error.message)
    return Promise.reject(error) // Propagate the error
  },
)

// --- Response Interceptors ---
// Interceptors allow you to process responses before they are handled by your application code.
// Common uses: global error handling, refreshing expired tokens, data transformation, logging responses.
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lies in the range of 2xx cause this function to trigger.
    // console.log('✅ Response Interceptor:', response); // For debugging
    return response
  },
  (error: AxiosError) => {
    // Any status codes that fall outside the range of 2xx cause this function to trigger.
    console.error('🔥 Response Error:', error.message)

    // Example: Global error handling based on status codes
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 400:
          console.error('Bad Request:', data)
          // @ts-expect-error fix this later
          throw new Error(data?.message ?? 'Bad Request') // Propagate error with message
        case 401:
          console.warn('Unauthorized: Token expired or invalid.')
          window.location.href = '/' // Redirect to login page
          break
        case 403:
          console.error(
            'Forbidden: You do not have permission to access this resource.',
            data,
          )
          break
        case 404:
          console.error(
            'Not Found: The requested resource was not found.',
            data,
          )
          // @ts-expect-error fix this later
          throw new Error(data?.message ?? 'Please check the URL.')
        case 500:
          console.error(
            'Server Error: Something went wrong on the server.',
            data,
          )
          throw new Error('Internal Server Error. Please try again later.')
        default:
          console.error(`Unhandled API Error (Status: ${status}):`, data)
          break
      }
    } else if (error.request) {
      console.error('Network Error: No response received from server.')
    } else {
      console.error('Error setting up request:', error.message)
    }

    return Promise.reject(error) // Always propagate the error so components/hooks can handle it
  },
)
