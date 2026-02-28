import { Outlet } from 'react-router-dom'
import { HiHome, HiTruck, HiCurrencyRupee, HiUser } from 'react-icons/hi'
import Sidebar from '../components/common/Sidebar'
import NotificationDropdown from '../components/common/NotificationDropdown'

const LINKS = [
  { label: 'Dashboard',   to: '/delivery',           icon: HiHome,         exact: true },
  // { label: 'Deliveries',  to: '/delivery/orders',    icon: HiTruck                     },
  { label: 'Earnings',    to: '/delivery/earnings',  icon: HiCurrencyRupee             },
  { label: 'Profile',     to: '/delivery/profile',   icon: HiUser                      },
]

export default function DeliveryLayout() {
  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar links={LINKS} title="Delivery Partner" icon="🛵" />

      <div className="flex-1 flex flex-col min-w-0 mt-14 md:mt-0">
        <header className="hidden md:flex items-center justify-end gap-3 px-8 py-4
                           bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm
                           border-b border-stone-100 dark:border-stone-800 sticky top-0 z-20">
          <NotificationDropdown />
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 max-w-5xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
