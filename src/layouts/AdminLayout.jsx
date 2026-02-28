import { Outlet } from 'react-router-dom'
import {
  HiHome, HiOfficeBuilding, HiUsers, HiClipboardList, HiChartBar,
} from 'react-icons/hi'
import Sidebar from '../components/common/Sidebar'
import NotificationDropdown from '../components/common/NotificationDropdown'

const LINKS = [
  { label: 'Dashboard',    to: '/admin',                    icon: HiHome,          exact: true },
  { label: 'Approvals',    to: '/admin/approvals',          icon: HiClipboardList              },
  { label: 'Restaurants',  to: '/admin/restaurants',        icon: HiOfficeBuilding             },
  { label: 'Users',        to: '/admin/users',              icon: HiUsers                      },
  { label: 'Order Management',  to: '/admin/orders',        icon: HiClipboardList              },
  { label: 'Analytics',    to: '/admin/analytics',          icon: HiChartBar                   },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar links={LINKS} title="Admin Panel" icon="⚙️" />

      <div className="flex-1 flex flex-col min-w-0 mt-14 md:mt-0">
        <header className="hidden md:flex items-center justify-between gap-3 px-8 py-4
                           bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm
                           border-b border-stone-100 dark:border-stone-800 sticky top-0 z-20">
          <h1 className="font-display font-semibold text-stone-700 dark:text-stone-300 text-sm">
            Admin Control Panel
          </h1>
          <NotificationDropdown />
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
