import { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const CART_KEY = import.meta.env.VITE_CART_KEY || 'fooddash_cart'
const CartContext = createContext(null)

/* ── Reducer ────────────────────────────────────── */
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, restaurantId, restaurantName } = action.payload

      // Enforce single-restaurant cart
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return { ...state, pendingItem: action.payload, showRestaurantConflict: true }
      }

      const exists = state.items.find((i) => i.id === item.id)
      const items = exists
        ? state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { ...item, quantity: 1 }]

      return { ...state, items, restaurantId, restaurantName, showRestaurantConflict: false }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
        ...(state.items.length === 1
          ? { restaurantId: null, restaurantName: null }
          : {}),
      }

    case 'INCREASE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }

    case 'DECREASE_QTY':
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0),
        ...(
          state.items.find((i) => i.id === action.payload)?.quantity === 1
            ? { restaurantId: state.items.length === 1 ? null : state.restaurantId }
            : {}
        ),
      }

    case 'CLEAR_CART':
      return initialState

    case 'LOAD_CART':
      return action.payload

    case 'CLEAR_CONFLICT':
      return { ...state, pendingItem: null, showRestaurantConflict: false }

    case 'CONFIRM_SWITCH': {
      const { item, restaurantId, restaurantName } = state.pendingItem
      return {
        items: [{ ...item, quantity: 1 }],
        restaurantId,
        restaurantName,
        pendingItem: null,
        showRestaurantConflict: false,
      }
    }

    default:
      return state
  }
}

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
  pendingItem: null,
  showRestaurantConflict: false,
}

/* ── Provider ───────────────────────────────────── */
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      return saved ? { ...init, ...JSON.parse(saved) } : init
    } catch {
      return init
    }
  })

  // Persist cart to localStorage (excluding UI-only fields)
  useEffect(() => {
    const { pendingItem, showRestaurantConflict, ...toSave } = state
    localStorage.setItem(CART_KEY, JSON.stringify(toSave))
  }, [state])

  /* ── Derived values ─────────────────────────── */
  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0)
  const subtotal   = state.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const deliveryFee = subtotal > 0 ? 29 : 0
  const taxes      = Math.round(subtotal * 0.05)
  const total      = subtotal + deliveryFee + taxes

  /* ── Actions ─────────────────────────────────── */
  const addItem = (item, restaurantId, restaurantName) => {
    dispatch({ type: 'ADD_ITEM', payload: { item, restaurantId, restaurantName } })
    if (!state.showRestaurantConflict) {
      toast.success(`${item.name} added to cart 🛒`, { id: `cart-${item.id}` })
    }
  }

  const removeItem     = (id) => dispatch({ type: 'REMOVE_ITEM',   payload: id })
  const increaseQty    = (id) => dispatch({ type: 'INCREASE_QTY',  payload: id })
  const decreaseQty    = (id) => dispatch({ type: 'DECREASE_QTY',  payload: id })
  const clearCart      = ()   => dispatch({ type: 'CLEAR_CART' })
  const clearConflict  = ()   => dispatch({ type: 'CLEAR_CONFLICT' })
  const confirmSwitch  = ()   => dispatch({ type: 'CONFIRM_SWITCH' })

  const getItemQty = (id) => state.items.find((i) => i.id === id)?.quantity || 0

  return (
    <CartContext.Provider
      value={{
        ...state,
        totalItems, subtotal, deliveryFee, taxes, total,
        addItem, removeItem, increaseQty, decreaseQty,
        clearCart, clearConflict, confirmSwitch, getItemQty,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
