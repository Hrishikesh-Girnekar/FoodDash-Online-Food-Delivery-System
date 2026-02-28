import axios from 'axios'
import toast from 'react-hot-toast'

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'fooddash_token'
const BASE_URL  = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

/* ── Request interceptor: attach JWT ──────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

/* ── Response interceptor: handle errors ──────── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error?.response?.status
    const message = error?.response?.data?.message || error?.message || 'Something went wrong'

    if (status === 401) {
      // Token expired → clear storage and redirect
      localStorage.removeItem(TOKEN_KEY)
      toast.error('Session expired. Please log in again.')
      window.location.href = '/login'
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else if (status === 404) {
      // Silently fail 404 — let the page handle it
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.')
    } else {
      // Let the caller decide whether to surface this
    }

    return Promise.reject({ message, status, raw: error })
  }
)

export default api
