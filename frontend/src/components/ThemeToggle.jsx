import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group relative inline-flex h-11 w-20 items-center rounded-full border border-green-200 bg-white/80 p-1 shadow-sm transition-all duration-300 hover:border-verdant-primary dark:border-emerald-800 dark:bg-gray-950"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span
        className={`absolute h-9 w-9 rounded-full bg-gradient-to-br from-verdant-primary to-green-400 shadow-md transition-transform duration-300 ${
          isDark ? 'translate-x-9' : 'translate-x-0'
        }`}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-2 text-xs text-gray-500 dark:text-gray-300">
        <Sun className="h-4 w-4" />
        <Moon className="h-4 w-4" />
      </span>
    </button>
  )
}
