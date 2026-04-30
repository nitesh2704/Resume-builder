import { useCallback } from 'react'
import { FilePlus2, Files, LayoutDashboard } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useResumes } from '../../context/ResumeContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppShell() {
  const { searchResumes } = useResumes()
  const location = useLocation()

  const handleSearch = useCallback(
    (keyword) => {
      if (location.pathname === '/dashboard') {
        searchResumes(keyword)
      }
    },
    [location.pathname, searchResumes]
  )

  return (
    <div className="min-h-screen text-gray-900 transition-colors duration-300 dark:text-gray-100">
      <Sidebar />
      <Navbar onSearch={handleSearch} />
      <main className="px-4 pb-24 pt-6 sm:px-6 lg:ml-80 lg:px-8 lg:pb-6">
        <Outlet />
      </main>
      <nav className="no-print fixed inset-x-4 bottom-4 z-40 grid grid-cols-3 gap-2 rounded-2xl border border-green-200 bg-white/90 p-2 shadow-card backdrop-blur-xl dark:border-emerald-900 dark:bg-gray-950/90 lg:hidden">
        {[
          { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
          { to: '/builder', label: 'Builder', icon: FilePlus2 },
          { to: '/templates', label: 'Templates', icon: Files }
        ].map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-verdant-primary text-white'
                    : 'text-gray-500 hover:bg-green-50 hover:text-verdant-primary dark:text-gray-300 dark:hover:bg-emerald-950'
                }`
              }
            >
              <Icon className="mb-1 h-4 w-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
