import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiStar, HiClock, HiLocationMarker, HiPhone, HiHeart } from 'react-icons/hi'
import MenuItemCard from '../../components/restaurant/MenuItemCard'
import { MenuItemSkeleton } from '../../components/common/Skeleton'
import { formatCurrency } from '../../utils/helpers'
import { useWishlist } from '../../hooks/useWishlist'
import axios from 'axios'

export default function RestaurantDetail() {
  const { id } = useParams()
  const { isWishlisted, toggle } = useWishlist()

  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch restaurant details
        const restaurantRes = await axios.get(
          `http://localhost:8080/api/v1/restaurants/${id}`
        )

        setRestaurant(restaurantRes.data.data)

        // Fetch menu items by restaurant id
        const menuRes = await axios.get(
          `http://localhost:8080/api/v1/menu/restaurant/${id}`
        )
        
        const items = menuRes.data.data || []

        // Transform backend fields → match frontend structure
        const transformedItems = items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          isVeg: item.isVeg,
          isBestseller: item.isBestseller,
          image: item.imageUrl,          // convert imageUrl → image
          available: item.isAvailable    // convert isAvailable → available
        }))

        // Group by category (like your old SAMPLE_MENU)
        const groupedMenu = transformedItems.reduce((acc, item) => {
          const category = item.category || 'Others'

          if (!acc[category]) {
            acc[category] = []
          }

          acc[category].push(item)
          return acc
        }, {})

        setMenu(groupedMenu)

        const firstSection = Object.keys(groupedMenu)[0]
        setActiveSection(firstSection || null)

      } catch (error) {
        console.error('Error fetching restaurant data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="skeleton h-56 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <MenuItemSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (!restaurant) return <div className="p-8 text-center text-stone-400">Restaurant not found</div>

  const wishlisted = isWishlisted(restaurant.id)
  const sections   = Object.keys(menu)

  return (
    <div className="page-enter">
      {/* Hero banner */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Wishlist */}
        <button
          onClick={() => toggle(restaurant)}
          className="absolute top-4 right-4 p-2.5 glass rounded-xl"
        >
          <HiHeart
            className={`w-6 h-6 transition-colors ${wishlisted ? 'text-red-500 fill-red-500' : 'text-white'}`}
          />
        </button>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="font-display font-bold text-3xl drop-shadow">{restaurant.name}</h1>
          <p className="text-white/80 text-sm mt-1">{restaurant.cuisine}</p>
        </div>
      </div>

      {/* Details strip */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 px-4 py-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-5 text-sm text-stone-600 dark:text-stone-400">
          <span className="flex items-center gap-1.5">
            <span className="bg-emerald-500 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <HiStar className="w-3 h-3" /> {restaurant.rating}
            </span>
            <span className="text-stone-400 text-xs">({restaurant.totalReviews?.toLocaleString()} reviews)</span>
          </span>
          <span className="flex items-center gap-1"><HiClock className="w-4 h-4" /> {restaurant.deliveryTime}</span>
          <span className="flex items-center gap-1">{formatCurrency(restaurant.costForTwo)} for two</span>
          <span className={`font-semibold ${restaurant.isOpen ? 'text-emerald-500' : 'text-stone-400'}`}>
            {restaurant.isOpen ? '● Open now' : '● Closed'}
          </span>
        </div>
      </div>

      {/* Body: Menu nav + items */}
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sticky section nav */}
        <aside className="md:w-48 flex-shrink-0">
          <div className="md:sticky md:top-24 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setActiveSection(s)
                  document.getElementById(`section-${s}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`
                  flex-shrink-0 text-sm font-medium px-4 py-2.5 rounded-xl text-left transition-all
                  ${activeSection === s
                    ? 'bg-brand-500 text-white shadow-brand'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }
                `}
              >
                {s}
                <span className="ml-1.5 text-xs opacity-70">({menu[s]?.length})</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Menu items */}
        <main className="flex-1 space-y-10">
          {sections.map((section) => (
            <div key={section} id={`section-${section}`}>
              <h2 className="font-display font-bold text-xl text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-3">
                {section}
                <span className="text-sm text-stone-400 font-normal">({menu[section].length} items)</span>
              </h2>
              <div className="space-y-4">
                {menu[section].map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <MenuItemCard
                      item={item}
                      restaurantId={restaurant.id}
                      restaurantName={restaurant.name}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}
