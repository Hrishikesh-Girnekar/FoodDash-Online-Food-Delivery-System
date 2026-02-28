# 🍜 FoodDash — Frontend

**Production-ready** food delivery frontend built with React + Vite + Tailwind CSS.

---

## 📁 Project Structure

```
src/
├── api/                   # Axios instance + all API call modules
│   ├── axiosInstance.js   # JWT interceptor + centralized error handling
│   ├── auth.api.js
│   ├── restaurant.api.js
│   ├── menu.api.js
│   ├── order.api.js
│   └── admin.api.js
│
├── components/
│   ├── common/            # Reusable UI: Button, Modal, Table, Skeleton, Spinner...
│   ├── cart/              # CartDrawer
│   └── restaurant/        # RestaurantCard, MenuItemCard, RatingStars
│
├── context/               # React Context API
│   ├── AuthContext.jsx    # Auth state, login/logout/register
│   ├── CartContext.jsx    # Cart reducer + localStorage persistence
│   ├── ThemeContext.jsx   # Dark mode toggle
│   └── NotificationContext.jsx
│
├── hooks/                 # Custom hooks
│   ├── useDebounce.js
│   ├── usePagination.js
│   ├── useLocalStorage.js
│   └── useWishlist.js
│
├── layouts/               # Role-specific layouts with sidebars
│   ├── PublicLayout.jsx
│   ├── CustomerLayout.jsx
│   ├── AdminLayout.jsx
│   ├── OwnerLayout.jsx
│   └── DeliveryLayout.jsx
│
├── pages/
│   ├── auth/              # Login, Register
│   ├── public/            # Home, RestaurantList, RestaurantDetail, NotFound
│   ├── customer/          # Dashboard, Checkout, OrderHistory, Wishlist, Profile...
│   ├── admin/             # Dashboard, Approvals, ManageUsers, ManageRestaurants, Analytics
│   ├── owner/             # Dashboard, ManageMenu, OwnerOrders, OwnerRestaurant
│   └── delivery/          # DeliveryDashboard, DeliveryEarnings
│
├── routes/
│   ├── ProtectedRoute.jsx # Redirect to /login if unauthenticated
│   └── RoleBasedRoute.jsx # Redirect if wrong role
│
└── utils/
    ├── helpers.js         # formatCurrency, formatDate, ORDER_STATUS_COLORS...
    └── constants.js       # ROLES, CUISINES, SORT_OPTIONS, sample data
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env to point to your Spring Boot backend
```

**Default `.env`:**
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_TOKEN_KEY=fooddash_token
VITE_CART_KEY=fooddash_cart
VITE_WISHLIST_KEY=fooddash_wishlist
```

### 3. Start development server

```bash
npm run dev
# Open http://localhost:5173
```

### 4. Build for production

```bash
npm run build
```

---

## 🔑 Demo Login Credentials

| Role              | Email               | Password |
|-------------------|---------------------|----------|
| Customer          | customer@demo.com   | demo123  |
| Restaurant Owner  | owner@demo.com      | demo123  |
| Admin             | admin@demo.com      | demo123  |
| Delivery Partner  | delivery@demo.com   | demo123  |

> These are shown in the Login page for easy testing.

---

## 🏗️ Architecture

### Authentication Flow
1. User logs in → Spring Boot returns `{ token, user }`
2. Token stored in `localStorage` (key: `fooddash_token`)
3. Every Axios request attaches `Authorization: Bearer <token>` via interceptor
4. On 401 response → token cleared → redirected to `/login`

### Role-Based Routing
```
CUSTOMER         → /customer/**
RESTAURANT_OWNER → /owner/**
ADMIN            → /admin/**
DELIVERY_PARTNER → /delivery/**
```
`ProtectedRoute` checks auth, `RoleBasedRoute` checks role.

### Cart System
- Global state via `CartContext` with `useReducer`
- Persisted to `localStorage` on every state change
- Single-restaurant enforcement (conflict modal if user switches)
- Slide-in `CartDrawer` with Framer Motion

### API Integration
All API calls are in `src/api/`. The sample data (restaurants, orders) currently mocks the API with `setTimeout`. To connect to your Spring Boot backend:

1. Set `VITE_API_BASE_URL` in `.env`
2. Replace the `setTimeout` mock blocks in pages with the actual API call
3. The API functions are already written — just uncomment them

**Example:**
```jsx
// Before (mock):
setTimeout(() => { setRestaurants(SAMPLE_DATA); setLoading(false) }, 600)

// After (real API):
try {
  const { data } = await restaurantApi.getAll({ page: currentPage })
  setRestaurants(data.content)
} catch (err) {
  toast.error(err.message)
} finally {
  setLoading(false)
}
```

---

## 📦 Key Dependencies

| Package          | Purpose                               |
|------------------|---------------------------------------|
| React 18         | UI framework                          |
| Vite             | Fast build tool                       |
| Tailwind CSS 3   | Utility-first styling                 |
| Framer Motion    | Animations & transitions              |
| React Router v6  | Client-side routing                   |
| Axios            | HTTP client with interceptors         |
| React Hot Toast  | Toast notifications                   |
| Recharts         | Analytics charts                      |
| React Icons      | Icon library (HeroIcons subset)       |

---

## ✨ Features Implemented

- ✅ JWT authentication with auto-logout on 401
- ✅ Role-based protected routes (4 roles)
- ✅ Global cart with localStorage persistence
- ✅ Dark mode toggle (system preference + manual)
- ✅ Debounced search
- ✅ Cuisine filter + rating filter + sort
- ✅ Pagination hook
- ✅ Wishlist (localStorage)
- ✅ Restaurant open/closed indicator
- ✅ Order tracking UI with progress bar
- ✅ Order status management (owner + delivery)
- ✅ Ratings & reviews UI
- ✅ Notification dropdown
- ✅ Reusable Modal, Table, Button, Skeleton
- ✅ Lazy-loaded routes (code splitting)
- ✅ Error Boundary
- ✅ Skeleton loaders
- ✅ Empty states with animations
- ✅ Toast notifications
- ✅ Responsive design (mobile-first)
- ✅ Collapsible sidebar
- ✅ Bottom navigation for mobile (Customer)
- ✅ Framer Motion page transitions & micro-interactions
- ✅ Glassmorphism cards & components
- ✅ Cart slide-in drawer
- ✅ Order success animation
- ✅ Revenue analytics charts (Recharts)
- ✅ 404 page
- ✅ API interceptor for JWT

---

## 🎨 Design System

- **Fonts:** Sora (display) + DM Sans (body)
- **Primary color:** Brand orange (`#f97316`)  
- **Border radius:** 2xl–4xl rounded corners
- **Shadows:** Soft card shadows, brand glow
- **Glassmorphism:** `.glass` utility class
- **Dark mode:** Tailwind `dark:` class strategy

---

## 🔌 Connecting to Spring Boot

Your Spring Boot backend should expose:

```
POST /api/auth/login         → { token, user }
POST /api/auth/register      → { token, user }
GET  /api/auth/profile       → user object
GET  /api/restaurants        → paginated list
GET  /api/restaurants/:id    → single restaurant
POST /api/orders             → place order
...etc
```

The JWT token is sent as `Authorization: Bearer <token>` automatically.
