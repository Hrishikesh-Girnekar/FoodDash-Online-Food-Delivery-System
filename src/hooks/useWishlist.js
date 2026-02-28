import { useLocalStorage } from './useLocalStorage'
import toast from 'react-hot-toast'

const WISHLIST_KEY = import.meta.env.VITE_WISHLIST_KEY || 'fooddash_wishlist'

export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorage(WISHLIST_KEY, [])

  const isWishlisted = (id) => wishlist.some((item) => item.id === id)

  const toggle = (restaurant) => {
    if (isWishlisted(restaurant.id)) {
      setWishlist(wishlist.filter((i) => i.id !== restaurant.id))
      toast('Removed from wishlist', { icon: '💔' })
    } else {
      setWishlist([...wishlist, restaurant])
      toast.success('Added to wishlist ❤️')
    }
  }

  return { wishlist, isWishlisted, toggle }
}
