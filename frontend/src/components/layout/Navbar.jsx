import { Plus, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../Button'
import ThemeToggle from '../ThemeToggle'

const titles = {
  '/dashboard': 'Dashboard',
  '/builder': 'Resume Builder',
  '/templates': 'Templates'
}

export default function Navbar({ onSearch }) {
  const location = useLocation()
  const title = titles[location.pathname] || (location.pathname.startsWith('/builder') ? 'Resume Builder' : 'EcoResume')

  return (
    <header className="no-print sticky top-0 z-20 border-b border-green-100/70 bg-verdant-light/70 backdrop-blur-2xl transition-colors duration-300 dark:border-emerald-950 dark:bg-verdant-dark/70 lg:ml-80">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/dashboard" className="lg:hidden">
            <img src="/logo.svg" alt="EcoResume" className="h-11 w-11 rounded-2xl shadow-md" />
          </Link>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-verdant-primary dark:text-green-300">EcoResume</p>
            <h1 className="truncate text-2xl font-extrabold text-gray-950 dark:text-white">{title}</h1>
          </div>
        </div>

        <div className="hidden max-w-md flex-1 items-center rounded-full border border-green-200 bg-white/80 px-4 py-2 shadow-sm dark:border-emerald-900 dark:bg-verdant-dark-panel/80 md:flex">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search resumes"
            onChange={(event) => onSearch?.(event.target.value)}
            className="w-full bg-transparent px-3 py-1 text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
          />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/builder" className="hidden sm:inline-flex">
            <Button className="px-4">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
