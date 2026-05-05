import { FilePlus2, Files, LayoutDashboard, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/builder', label: 'Builder', icon: FilePlus2 },
  { to: '/templates', label: 'Templates', icon: Files }
]

export default function Sidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="no-print fixed inset-y-4 left-4 z-30 hidden w-72 flex-col rounded-2xl border border-green-200/60 bg-gradient-to-b from-white/70 via-green-50/70 to-emerald-100/70 p-4 shadow-card backdrop-blur-2xl dark:border-emerald-900/50 dark:from-gray-950/80 dark:via-emerald-950/70 dark:to-black/80 lg:flex">
      <div className="flex items-center gap-3 px-2 py-3">
        <img src="/logo.svg" alt="EcoResume AI" className="h-11 w-11 rounded-2xl shadow-md" />
        <div>
          <p className="text-lg font-extrabold text-gray-950 dark:text-white">EcoResume AI</p>
          <p className="text-xs font-semibold text-verdant-primary dark:text-green-300">Resume Studio</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-full px-4 py-3 text-sm font-bold transition-all duration-300 ${isActive
                  ? 'bg-verdant-primary text-white shadow-glow'
                  : 'text-gray-600 hover:bg-white/80 hover:text-verdant-primary dark:text-gray-300 dark:hover:bg-gray-900'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-green-200/80 bg-white/70 p-4 dark:border-emerald-900 dark:bg-gray-950/60">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-sm font-extrabold text-verdant-primary dark:bg-emerald-950 dark:text-green-300">
            {user?.name?.slice(0, 2).toUpperCase() || 'VA'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{user?.name || 'Verdant User'}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-green-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition-all duration-300 hover:border-verdant-primary hover:text-verdant-primary dark:border-emerald-900 dark:text-gray-300"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
