import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// import { authApi } from '../api/auth.api'
import toast from "react-hot-toast";
import axios from "axios";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "fooddash_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial auth check

  /* ── Initialise: load user from token ──────── */
  // useEffect(() => {
  //   const token = localStorage.getItem(TOKEN_KEY)
  //   if (token) {
  //     authApi.getProfile()
  //       .then(({ data }) => setUser(data))
  //       .catch(() => localStorage.removeItem(TOKEN_KEY))
  //       .finally(() => setLoading(false))
  //   } else {
  //     setLoading(false)
  //   }
  // }, [])
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const role = localStorage.getItem("fooddash_role");
    const name = localStorage.getItem("fooddash_name");

    if (token && role) {
      setUser({ token, role, name });
    }

    setLoading(false);
  }, []);

  /* ── Login ──────────────────────────────────── */
  // const login = useCallback(async (credentials) => {
  //   const res = await authApi.login(credentials)

  //   // 🔥 unwrap correctly
  //   const { success, message, data } = res.data

  //   if (!success || !data?.accessToken) {
  //     throw new Error(message || 'Login failed')
  //   }

  //   localStorage.setItem(TOKEN_KEY, data.accessToken)
  //   setUser({ token: data.accessToken })

  //   toast.success(message)

  //   return data   // return accessToken object
  // }, [])

  // const login = useCallback(async (credentials) => {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:8080/api/v1/auth/login",
  //       credentials,
  //     );

  //     const { success, message, data } = res.data;

  //     if (!success || !data?.accessToken) {
  //       throw new Error(message || "Login failed");
  //     }

  //     localStorage.setItem(TOKEN_KEY, data.accessToken);
  //     localStorage.setItem("fooddash_role", data.role);
  //     localStorage.setItem("fooddash_name", data.fullname);

  //     // ✅ IMPORTANT: store role also
  //     setUser({
  //       token: data.accessToken,
  //       role: data.role,
  //       name: data.fullname,
  //     });

  //     toast.success(message);

  //     return data;
  //   } catch (err) {
  //     throw new Error(
  //       err.response?.data?.message || err.message || "Login failed",
  //     );
  //   }
  // }, []);
  const login = useCallback(async (credentials) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/v1/auth/login",
      credentials,
    );

    const { success, message, data } = res.data;

    if (!success || !data?.accessToken) {
      throw new Error(message || "Login failed");
    }

    // ✅ Store token (same as before)
    localStorage.setItem(TOKEN_KEY, data.accessToken);

    // ✅ Store role (same as before)
    localStorage.setItem("fooddash_role", data.role);

    // ✅ Store fullname (same as before)
    localStorage.setItem("fooddash_name", data.fullname);

    // 🔥 NEW: store restaurants list
    localStorage.setItem(
      "fooddash_restaurants",
      JSON.stringify(data.restaurants || [])
    );

    // 🔥 NEW: store active restaurant (default = first one if owner)
    if (data.role === "RESTAURANT_OWNER" && data.restaurants?.length > 0) {
      localStorage.setItem(
        "fooddash_activeRestaurant",
        data.restaurants[0].id
      );
    }

    // 🔥 UPDATED setUser (added restaurants)
    setUser({
      token: data.accessToken,
      role: data.role,
      name: data.fullname,
      restaurants: data.restaurants || [],
      activeRestaurant:
        data.role === "RESTAURANT_OWNER" && data.restaurants?.length > 0
          ? data.restaurants[0].id
          : null,
    });

    toast.success(message);

    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Login failed",
    );
  }
}, []);

  // const login = useCallback(async (credentials) => {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:8080/api/v1/auth/login",
  //       credentials
  //     )
  //     console.log(res.data);

  //     const { accessToken, role, name } = res.data

  //     if (!accessToken) {
  //       throw new Error("Login failed")
  //     }

  //     // ✅ Save everything properly
  //     localStorage.setItem(TOKEN_KEY, accessToken)
  //     localStorage.setItem("fooddash_role", role)
  //     localStorage.setItem("fooddash_name", name)

  //     // ✅ Update state
  //     setUser({
  //       token: accessToken,
  //       role,
  //       name
  //     })

  //     toast.success("Login successful")

  //     return res.data

  //   } catch (err) {
  //     throw new Error(
  //       err.response?.data?.message ||
  //       err.message ||
  //       "Login failed"
  //     )
  //   }
  // }, [])

  /* ── Register ───────────────────────────────── */
  // const register = useCallback(async (userData) => {
  //   const res = await authApi.register(userData)

  //   const { success, message } = res

  //   if (!success) {
  //     throw new Error(message || 'Registration failed')
  //   }

  //   toast.success(message)

  //   return true
  // }, [])

  /* ── Logout ─────────────────────────────────── */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("fooddash_role");
    localStorage.removeItem("fooddash_name");
    localStorage.removeItem(import.meta.env.VITE_CART_KEY || "fooddash_cart");
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  /* ── Update profile ─────────────────────────── */
  // const updateUser = useCallback((updates) => {
  //   setUser((prev) => ({ ...prev, ...updates }));
  // }, []);
  // const updateUser = useCallback((updates) => {
  //   setUser((prev) => {
  //     const updated = { ...prev, ...updates };
  //     localStorage.setItem("user", JSON.stringify(updated)); // 👈 add this
  //     return updated;
  //   });
  // }, []);
  // const updateUser = useCallback((updates) => {
  //   setUser((prev) => {
  //     const updated = { ...prev, ...updates };

  //     if (updates.name) {
  //       localStorage.setItem("fooddash_name", updates.name);
  //     }

  //     return updated;
  //   });
  // }, []);
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
