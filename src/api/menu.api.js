import api from './axiosInstance'

export const menuApi = {
  getByRestaurant: (restaurantId) =>
    api.get(`/menu/restaurant/${restaurantId}`),

  // ✅ ADD ITEM (with image)
  addItem: (data) =>
    api.post(`/menu`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // ✅ UPDATE ITEM (with optional image)
  updateItem: (id, data) =>
    api.put(`/menu/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteItem: (id) =>
    api.delete(`/menu/${id}`),

  toggleAvailable: (id) =>
    api.patch(`/menu/${id}/toggle`),
}