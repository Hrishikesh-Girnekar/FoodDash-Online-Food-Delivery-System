import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiSearch, HiAdjustments } from 'react-icons/hi'
import axios from 'axios'

import RestaurantCard from '../../components/restaurant/RestaurantCard'
import { RestaurantCardSkeleton } from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { useDebounce } from '../../hooks/useDebounce'
import { usePagination } from '../../hooks/usePagination'
import { CUISINES, SORT_OPTIONS } from '../../utils/constants'

export default function RestaurantList() {
  const [searchParams] = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [cuisine, setCuisine] = useState('All')
  const [sortBy, setSortBy] = useState('relevance')
  const [minRating, setMinRating] = useState(0)

  const [loading, setLoading] = useState(true)
  const [restaurants, setRestaurants] = useState([])
  const [filtered, setFiltered] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState(null)

  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem("fooddash_token")

        const res = await axios.get(
          "http://localhost:8080/api/v1/restaurants/approved", // your public endpoint
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {}
          }
        )

        const { success, data } = res.data

        if (success) {
          setRestaurants(data)
          setFiltered(data)
        } else {
          setError("Failed to load restaurants")
        }

      } catch (err) {
        console.error(err)
        setError("Something went wrong while fetching restaurants")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  useEffect(() => {
    let result = [...restaurants]

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine?.toLowerCase().includes(q)
      )
    }

    if (cuisine !== 'All')
      result = result.filter((r) => r.cuisine === cuisine)

    if (minRating)
      result = result.filter((r) => r.rating >= minRating)

    if (sortBy === 'rating')
      result.sort((a, b) => b.rating - a.rating)

    if (sortBy === 'costAsc')
      result.sort((a, b) => a.costForTwo - b.costForTwo)

    if (sortBy === 'costDesc')
      result.sort((a, b) => b.costForTwo - a.costForTwo)

    setFiltered(result)
  }, [debouncedQuery, cuisine, sortBy, minRating, restaurants])

  const { currentPage, totalPages, pageNumbers, goTo, next, prev } =
    usePagination({ totalItems: filtered.length, pageSize: 8 })

  const paginated = filtered.slice((currentPage - 1) * 8, currentPage * 8)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 page-enter">

      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-stone-800 dark:text-stone-100">
          Restaurants
        </h1>
        <p className="text-stone-400 mt-1">
          {filtered.length} restaurants available
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex-1 relative min-w-[220px]">
          <HiSearch className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" />
          <input
            type="text"
            className="input pl-11"
            placeholder="Search restaurants or cuisines…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="input w-auto"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters((s) => !s)}
          className="btn-secondary flex items-center gap-2"
        >
          <HiAdjustments className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <EmptyState
          icon="⚠️"
          title="Failed to load"
          message={error}
        />
      )}

      {/* No Results */}
      {!loading && !error && paginated.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No restaurants found"
          message="Try adjusting your filters"
        />
      )}

      {/* Grid */}
      {!loading && !error && paginated.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          {paginated.map((r) => (
            <motion.div
              key={r.id}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            >
              <RestaurantCard restaurant={r} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <Pagination {...{ currentPage, totalPages, pageNumbers, goTo, next, prev }} />
    </div>
  )
}
