import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* ── Request interceptor: attach JWT ──────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

/* ── Response interceptor: handle errors ──────── */

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // ✅ Handle 401 or 403
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken }, // send as JSON object
          { headers: { "Content-Type": "application/json" } },
        );

        const newAccessToken = refreshResponse.data.data.accessToken;

        // Save new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Update header for original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh also fails → logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        toast.error("Session expired. Please login again.");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // Other errors
    if (status >= 500) {
      toast.error("Server error. Please try again.");
    }

    return Promise.reject(error);
  },
);
export default api;
