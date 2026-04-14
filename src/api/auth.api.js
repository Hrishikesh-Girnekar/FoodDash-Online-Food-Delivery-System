import api from './axiosInstance'

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),

  register: (userData) => api.post('/auth/register', userData),

  logout: () => api.post('/auth/logout'),

  refreshToken: () => api.post('/auth/refresh'),

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (data) => api.put('/auth/profile', data),

  changePassword: (data) => api.put('/auth/change-password', data),
}
