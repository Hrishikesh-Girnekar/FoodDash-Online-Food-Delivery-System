import api from './axiosInstance'

// Public - GET all approved restaurants
export const getApprovedRestaurants = () =>
  api.get("/restaurants/approved");

// OWNER - GET all restaurants
export const getOwnerRestaurants = () =>
  api.get("/restaurants");

// OWNER - CREATE restaurant
export const createOwnerRestaurant = (data) =>
  api.post("/restaurants", data,{
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// OWNER - UPDATE restaurant
export const updateOwnerRestaurant = (id, data) =>
  api.put(`/restaurants/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// OWNER - DELETE restaurant
export const deleteOwnerRestaurant = (id) =>
  api.delete(`/restaurants/${id}`);

// OWNER - TOGGLE open/close
export const toggleOwnerRestaurant = (id) =>
  api.patch(`/restaurants/${id}/toggle`);

// OWNER - Submit restaurant for approval (separate page)
export const submitRestaurantForApproval = (data) =>
  api.post("/restaurants", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getDashboardStats = () =>
    api.get('/restaurants/dashboard/stats');

export const getRecentOrders = () =>
    api.get('/restaurants/dashboard/recent-orders');


