export default function FormField({ label, error, as = 'input', className = '', ...props }) {
  const Component = as
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
      <Component className="verdant-input" {...props} />
      {error ? <span className="text-xs font-medium text-red-600 dark:text-red-300">{error}</span> : null}
    </label>
  )
}
