import api from "./axiosInstance";

export const adminApi = {
  getUsers: (params) => api.get("/admin/users", { params }),

  banUser: (id) => api.put(`/admin/users/${id}/ban`),

  unbanUser: (id) => api.put(`/admin/users/${id}/unban`),

  getDashboardStats: () => api.get("/admin/dashboard/stats"),

  //  NEW — Pending Restaurants
  getRestaurantsByStatus: (status) =>
    api.get(`/admin/restaurants/status/${status}`),

  //  NEW — Update Restaurant Status
  updateRestaurantStatus: (id, status) =>
    api.patch(`/admin/restaurants/${id}/status`, null, {
      params: { status },
    }),

  //  NEW — Get All Restaurants
  getAllRestaurants: () => api.get("/admin/restaurants"),

  //  NEW — Delete Restaurant
  deleteRestaurant: (id) => api.delete(`/admin/restaurants/${id}`),
};
