import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Confirmed',
      body: 'Your order #FD1234 has been confirmed.',
      time: '2 min ago',
      read: false,
      type: 'order',
    },
    {
      id: 2,
      title: 'Out for Delivery',
      body: 'Your order is on the way! ETA 15 mins.',
      time: '10 min ago',
      read: false,
      type: 'delivery',
    },
    {
      id: 3,
      title: 'Rate your meal',
      body: 'How was your order from Burger Barn?',
      time: '1 hr ago',
      read: true,
      type: 'review',
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markRead = useCallback((id) => {
    setNotifications((ns) =>
      ns.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))
  }, [])

  const addNotification = useCallback((notif) => {
    setNotifications((ns) => [{ id: Date.now(), read: false, ...notif }, ...ns])
  }, [])

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
