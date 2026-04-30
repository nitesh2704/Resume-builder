import { Loader2 } from 'lucide-react'

const variants = {
  primary:
    'bg-gradient-to-r from-verdant-primary to-green-500 text-white shadow-md hover:shadow-glow hover:brightness-105',
  secondary:
    'border border-green-300 bg-white/70 text-verdant-primary hover:border-verdant-primary hover:bg-green-50 dark:border-emerald-800 dark:bg-gray-950/50 dark:text-green-300 dark:hover:bg-emerald-950',
  ghost:
    'text-gray-600 hover:bg-green-50 hover:text-verdant-primary dark:text-gray-300 dark:hover:bg-emerald-950 dark:hover:text-green-300',
  danger:
    'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300'
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
      disabled={loading || disabled}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  )
}
