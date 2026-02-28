/* ── Currency ────────────────────────────────────── */
export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

/* ── Date / Time ─────────────────────────────────── */
export const formatDate = (dateStr) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(dateStr))

export const formatDateTime = (dateStr) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr))

export const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

/* ── String helpers ──────────────────────────────── */
export const truncate = (str, n = 60) =>
  str.length > n ? str.slice(0, n - 3) + '…' : str

export const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''

export const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

/* ── Order status helpers ────────────────────────── */
export const ORDER_STATUS_COLORS = {
  PENDING:    'warning',
  PLACED:     'warning',
  ACCEPTED: 'info',
  PREPARING:  'brand',
  ASSIGNED: 'info',
  PICKED_UP:'info',
  ON_THE_WAY:'info',
  OUT_FOR_DELIVERY: 'info',
  DELIVERED:  'success',
  CANCELLED:  'error',
}

export const ORDER_STATUS_LABELS = {
  PLACED:              'Placed',
  PENDING:             'Pending',
  ACCEPTED:            'Accepted',
  ASSIGNED:            'Assigned',
  PICKED_UP:           'Picked up',
  ON_THE_WAY:          'On the Way',
  PREPARING:           'Preparing',
  OUT_FOR_DELIVERY:    'Out for Delivery',
  DELIVERED:           'Delivered',
  CANCELLED:           'Cancelled',
}

/* ── Rating ──────────────────────────────────────── */
export const ratingToStars = (rating) => {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return { full, half, empty }
}

/* ── Role redirect map ───────────────────────────── */
export const ROLE_HOME = {
  CUSTOMER:          '/customer',
  ADMIN:             '/admin',
  RESTAURANT_OWNER:  '/owner',
  DELIVERY_PARTNER:  '/delivery',
}
