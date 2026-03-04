import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import toast from "react-hot-toast";
import { authApi } from "../api/auth.api";

// const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "fooddash_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial auth check

  /* ── Initialise: load user from token ──────── */

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("fooddash_role");
    const name = localStorage.getItem("fooddash_name");
    const restaurants = JSON.parse(
      localStorage.getItem("fooddash_restaurants") || "[]",
    );
    const activeRestaurant = localStorage.getItem("fooddash_activeRestaurant");

    if (accessToken && role) {
      setUser({
        token: accessToken,
        role,
        name,
        restaurants,
        activeRestaurant,
      });
    }

    setLoading(false);
  }, []);

  /* ── Login ──────────────────────────────────── */

  const login = useCallback(async (credentials) => {
    try {
      const res = await authApi.login(credentials);

      const { success, message, data } = res.data;

      if (!success || !data?.accessToken) {
        throw new Error(message || "Login failed");
      }

      //  Store tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      //  Store role & name
      localStorage.setItem("fooddash_role", data.role);
      localStorage.setItem("fooddash_name", data.fullname);

      //  Store restaurants
      localStorage.setItem(
        "fooddash_restaurants",
        JSON.stringify(data.restaurants || []),
      );

      //  Store active restaurant if owner
      let activeRestaurant = null;
      if (data.role === "RESTAURANT_OWNER" && data.restaurants?.length > 0) {
        activeRestaurant = data.restaurants[0].id;
        localStorage.setItem("fooddash_activeRestaurant", activeRestaurant);
      }

      //  Update context state
      setUser({
        token: data.accessToken,
        role: data.role,
        name: data.fullname,
        restaurants: data.restaurants || [],
        activeRestaurant,
      });

      toast.success(message);
      return data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || err.message || "Login failed",
      );
    }
  }, []);

  /* ── Logout ─────────────────────────────────── */
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("fooddash_role");
    localStorage.removeItem("fooddash_name");
    localStorage.removeItem("fooddash_restaurants");
    localStorage.removeItem("fooddash_activeRestaurant");
    localStorage.removeItem(import.meta.env.VITE_CART_KEY || "fooddash_cart");

    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  /* ── Update profile ─────────────────────────── */
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };

      // keep localStorage in sync
      if (updates.name) {
        localStorage.setItem("fooddash_name", updates.name);
      }

      if (updates.role) {
        localStorage.setItem("fooddash_role", updates.role);
      }

      return updated;
    });
  }, []);

  const isAuthenticated = !!user;
  const role = user?.role || null;

  const hasRole = (r) => role === r;
  const isAdmin = hasRole("ADMIN");
  const isCustomer = hasRole("CUSTOMER");
  const isOwner = hasRole("RESTAURANT_OWNER");
  const isDeliveryPartner = hasRole("DELIVERY_PARTNER");

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        role,
        isAdmin,
        isCustomer,
        isOwner,
        isDeliveryPartner,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
