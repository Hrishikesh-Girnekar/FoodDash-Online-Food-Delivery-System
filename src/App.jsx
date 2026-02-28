import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Spinner from './components/common/Spinner'
import ErrorBoundary from './components/common/ErrorBoundary'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleBasedRoute from './routes/RoleBasedRoute'

/* ── Layouts ──────────────────────────────────────── */
import PublicLayout   from './layouts/PublicLayout'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout    from './layouts/AdminLayout'
import OwnerLayout    from './layouts/OwnerLayout'
import DeliveryLayout from './layouts/DeliveryLayout'


/* ── Auth Pages ──────────────────────────────────── */
const Login    = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))

/* ── Public Pages ────────────────────────────────── */
const Home              = lazy(() => import('./pages/public/Home'))
const RestaurantList    = lazy(() => import('./pages/public/RestaurantList'))
const RestaurantDetail  = lazy(() => import('./pages/public/RestaurantDetail'))
const NotFound          = lazy(() => import('./pages/public/NotFound'))

/* ── Customer Pages ──────────────────────────────── */
const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'))
const Checkout          = lazy(() => import('./pages/customer/Checkout'))
const OrderSuccess      = lazy(() => import('./pages/customer/OrderSuccess'))
const OrderHistory      = lazy(() => import('./pages/customer/OrderHistory'))
const Wishlist          = lazy(() => import('./pages/customer/Wishlist'))
const Profile           = lazy(() => import('./pages/customer/Profile'))

/* ── Admin Pages ─────────────────────────────────── */
const AdminDashboard        = lazy(() => import('./pages/admin/AdminDashboard'))
const RestaurantApprovals   = lazy(() => import('./pages/admin/RestaurantApprovals'))
const ManageUsers           = lazy(() => import('./pages/admin/ManageUsers'))
const ManageRestaurants     = lazy(() => import('./pages/admin/ManageRestaurants'))
const AdminAnalytics        = lazy(() => import('./pages/admin/AdminAnalytics'))
const AdminOrders           = lazy(() => import('./pages/admin/AdminOrders'))

/* ── Owner Pages ─────────────────────────────────── */
const OwnerDashboard   = lazy(() => import('./pages/owner/OwnerDashboard'))
const ManageMenu       = lazy(() => import('./pages/owner/ManageMenu'))
const OwnerOrders      = lazy(() => import('./pages/owner/OwnerOrders'))
const OwnerRestaurant  = lazy(() => import('./pages/owner/OwnerRestaurant'))
const ManageOwnerRestaurants = lazy(() => import('./pages/owner/ManageOwnerRestaurants'))
const OwnerProfile           = lazy(() => import('./pages/owner/OwnerProfile'))
/* ── Delivery Pages ──────────────────────────────── */
const DeliveryDashboard = lazy(() => import('./pages/delivery/DeliveryDashboard'))
const DeliveryEarnings  = lazy(() => import('./pages/delivery/DeliveryEarnings'))
const DeliveryProfile  = lazy(() => import('./pages/delivery/DeliveryProfile'))

/* ── Fallback ────────────────────────────────────── */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Spinner size="lg" />
  </div>
)

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Auth ────────────────────────────────── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Public ──────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/restaurants"           element={<RestaurantList />} />
            <Route path="/restaurants/:id"       element={<RestaurantDetail />} />
          </Route>

          {/* ── Customer (protected) ────────────────── */}
          <Route element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['CUSTOMER']}>
                <CustomerLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }>
            <Route path="/customer"           element={<CustomerDashboard />} />
            <Route path="/customer/checkout"  element={<Checkout />} />
            <Route path="/customer/order-success" element={<OrderSuccess />} />
            <Route path="/customer/orders"    element={<OrderHistory />} />
            <Route path="/customer/wishlist"  element={<Wishlist />} />
            <Route path="/customer/profile"   element={<Profile />} />
          </Route>

          {/* ── Admin (protected) ───────────────────── */}
          <Route element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }>
            <Route path="/admin"                element={<AdminDashboard />} />
            <Route path="/admin/approvals"      element={<RestaurantApprovals />} />
            <Route path="/admin/users"          element={<ManageUsers />} />
            <Route path="/admin/restaurants"    element={<ManageRestaurants />} />
            <Route path="/admin/analytics"      element={<AdminAnalytics />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>

          {/* ── Owner (protected) ───────────────────── */}
          <Route element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['RESTAURANT_OWNER']}>
                <OwnerLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }>
            <Route path="/owner"                element={<OwnerDashboard />} />
            <Route path="/owner/myrestaurant"  element={<ManageOwnerRestaurants />} />
            <Route path="/owner/restaurant"    element={<OwnerRestaurant />} />
            <Route path="/owner/menu"          element={<ManageMenu />} />
            <Route path="/owner/orders"        element={<OwnerOrders />} />
            <Route path="/owner/profile"        element={<OwnerProfile />} />
          </Route>

          {/* ── Delivery (protected) ────────────────── */}
          <Route element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['DELIVERY_PARTNER']}>
                <DeliveryLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }>
            <Route path="/delivery"          element={<DeliveryDashboard />} />
            <Route path="/delivery/orders"   element={<DeliveryDashboard />} />
            <Route path="/delivery/earnings" element={<DeliveryEarnings />} />
            <Route path="/delivery/profile" element={<DeliveryProfile />} />
          </Route>

          {/* ── 404 ─────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
