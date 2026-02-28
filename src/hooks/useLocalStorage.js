import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const val = value instanceof Function ? value(stored) : value
      setStored(val)
      localStorage.setItem(key, JSON.stringify(val))
    } catch (error) {
      console.error(`useLocalStorage error for key "${key}":`, error)
    }
  }

  const remove = () => {
    localStorage.removeItem(key)
    setStored(initialValue)
  }

  return [stored, setValue, remove]
}
