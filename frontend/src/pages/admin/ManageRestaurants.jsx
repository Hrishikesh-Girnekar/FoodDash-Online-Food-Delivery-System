import { useState, useEffect } from 'react'
import { HiSearch, HiTrash } from 'react-icons/hi'
import Table from '../../components/common/Table'
import { useDebounce } from '../../hooks/useDebounce'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading]         = useState(true)
  const [query, setQuery]             = useState('')
  const debouncedQ                    = useDebounce(query)



  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem("fooddash_token")
        
        if (!token) {
        toast.error("Please login again")
        return
      }

        const res = await axios.get(
          "http://localhost:8080/api/v1/admin/restaurants",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = res.data.data || res.data

        setRestaurants(data)

      } catch (err) {
        console.log(err);
        
        toast.error(
          err.response?.data?.message ||
          "Failed to fetch restaurants"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  //Search filter (frontend filtering)
  const filteredRestaurants = debouncedQ
    ? restaurants.filter((r) =>
        r.name.toLowerCase().includes(debouncedQ.toLowerCase())
      )
    : restaurants

  //Delete restaurant (real backend call)
  const remove = async (id) => {
    try {
      const token = localStorage.getItem("fooddash_token")

      await axios.delete(
        `http://localhost:8080/api/v1/admin/restaurants/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setRestaurants((prev) => prev.filter((r) => r.id !== id))
      toast.success("Restaurant removed")

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to delete restaurant"
      )
    }
  }


  const columns = [
    { key: 'name',       label: 'Name',       render: (v) => <span className="font-semibold">{v}</span> },
    { key: 'cuisine',    label: 'Cuisine'  },
    { key: 'rating',     label: 'Rating',     render: (v) => <span className="font-semibold text-amber-500">{v} ★</span> },
    { key: 'costForTwo', label: 'Cost/2',     render: (v) => formatCurrency(v) },
    {
      key: 'status',     label: 'Status',
      render: (v) => (
        <span className={`badge ${v === 'APPROVED' ? 'badge-success' : 'badge-warning'} text-xs`}>{v}</span>
      ),
    },
    {
      key: 'id', label: 'Actions',
      render: (id) => (
        <button
          onClick={() => remove(id)}
          className="p-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200"
        >
          <HiTrash className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">All Restaurants</h1>
        <p className="text-stone-400 text-sm mt-1">{restaurants.length} restaurants</p>
      </div>

      <div className="relative max-w-sm">
        <HiSearch className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" />
        <input className="input pl-11" placeholder="Search restaurants…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <Table columns={columns} rows={restaurants} loading={loading} emptyTitle="No restaurants found" />
    </div>
  )
}
