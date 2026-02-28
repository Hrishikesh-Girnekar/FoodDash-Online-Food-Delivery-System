import api from './axiosInstance'

// OWNER - GET all restaurants
export const getOwnerRestaurants = () =>
  api.get("/owner/restaurants");

// OWNER - CREATE restaurant
export const createOwnerRestaurant = (data) =>
  api.post("/owner/restaurants", data);

// OWNER - UPDATE restaurant
export const updateOwnerRestaurant = (id, data) =>
  api.put(`/owner/restaurants/${id}`, data);

// OWNER - DELETE restaurant
export const deleteOwnerRestaurant = (id) =>
  api.delete(`/owner/restaurants/${id}`);

// OWNER - TOGGLE open/close
export const toggleOwnerRestaurant = (id) =>
  api.patch(`/owner/restaurants/${id}/toggle`);

// OWNER - Submit restaurant for approval (separate page)
export const submitRestaurantForApproval = (data) =>
  api.post("/restaurants", data);


