export const ROLES = {
  CUSTOMER:         'CUSTOMER',
  ADMIN:            'ADMIN',
  RESTAURANT_OWNER: 'RESTAURANT_OWNER',
  DELIVERY_PARTNER: 'DELIVERY_PARTNER',
}

export const CUISINES = [
  'All', 'Indian', 'Chinese', 'Italian', 'Mexican',
  'Thai', 'Japanese', 'Continental', 'Fast Food',
  'Desserts', 'Beverages', 'Healthy', 'Vegan',
]

export const ORDER_STATUSES = [
  'PENDING', 'CONFIRMED', 'PREPARING',
  'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED',
]

export const DELIVERY_STATUSES = [
  'ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED',
]

export const SORT_OPTIONS = [
  { label: 'Relevance',   value: 'relevance' },
  { label: 'Rating',      value: 'rating' },
  { label: 'Delivery Time', value: 'deliveryTime' },
  { label: 'Cost: Low to High', value: 'costAsc' },
  { label: 'Cost: High to Low', value: 'costDesc' },
]

export const RATING_FILTERS = [
  { label: '4.5+',  value: 4.5 },
  { label: '4.0+',  value: 4.0 },
  { label: '3.5+',  value: 3.5 },
  { label: 'All',   value: 0   },
]

export const SAMPLE_RESTAURANTS = [
  {
    id: 1, name: 'Burger Barn', cuisine: 'Fast Food', rating: 4.5,
    deliveryTime: '25-30 min', costForTwo: 350,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    isOpen: true, totalReviews: 1240,
  },
  {
    id: 2, name: 'Spice Garden', cuisine: 'Indian', rating: 4.3,
    deliveryTime: '35-40 min', costForTwo: 450,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    isOpen: true, totalReviews: 876,
  },
  {
    id: 3, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.7,
    deliveryTime: '30-40 min', costForTwo: 500,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    isOpen: false, totalReviews: 2100,
  },
  {
    id: 4, name: 'Wok & Roll', cuisine: 'Chinese', rating: 4.1,
    deliveryTime: '20-25 min', costForTwo: 300,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
    isOpen: true, totalReviews: 540,
  },
  {
    id: 5, name: 'Sushi Zen', cuisine: 'Japanese', rating: 4.8,
    deliveryTime: '40-50 min', costForTwo: 800,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400',
    isOpen: true, totalReviews: 389,
  },
  {
    id: 6, name: 'Green Bowl', cuisine: 'Healthy', rating: 4.4,
    deliveryTime: '20-30 min', costForTwo: 400,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    isOpen: true, totalReviews: 712,
  },
]
