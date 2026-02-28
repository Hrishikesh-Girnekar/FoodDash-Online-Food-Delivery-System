import api from './axiosInstance'

export const menuApi = {
  getByRestaurant: (restaurantId) =>
    api.get(`/menu/restaurant/${restaurantId}`),

  addItem: (data) =>
    api.post(`/menu`, data),

  updateItem: (id, data) =>
    api.put(`/menu/${id}`, data),

  deleteItem: (id) =>
    api.delete(`/menu/${id}`),

  toggleAvailable: (id) =>
    api.patch(`/menu/${id}/toggle`)
}