import api from './axiosInstance'

export const adminApi = {

  getUsers: (params) =>
    api.get('/admin/users', { params }),

  banUser: (id) =>
    api.put(`/admin/users/${id}/ban`),

  unbanUser: (id) =>
    api.put(`/admin/users/${id}/unban`),

  getDashboardStats: () =>
  api.get('/admin/dashboard/stats'),

}
