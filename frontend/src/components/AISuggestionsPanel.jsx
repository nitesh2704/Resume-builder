import { CheckCircle2, Lightbulb, Sparkles, Wand2 } from 'lucide-react'

function SuggestionGroup({ icon: Icon, title, items }) {
  return (
    <div className="rounded-2xl border border-green-200 bg-white/80 p-4 shadow-sm dark:border-emerald-900 dark:bg-verdant-dark-panel/70">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-verdant-primary dark:bg-emerald-950 dark:text-green-300">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {(items || []).map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-verdant-primary dark:text-green-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AISuggestionsPanel({ suggestions, loading }) {
  if (loading) {
    return (
      <div className="verdant-panel rounded-2xl p-5">
        <div className="flex items-center gap-3 text-sm font-bold text-verdant-primary dark:text-green-300">
          <Sparkles className="h-5 w-5 animate-pulse" />
          Generating role suggestions...
        </div>
      </div>
    )
  }

  if (!suggestions) {
    return (
      <div className="verdant-panel rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-verdant-primary dark:bg-emerald-950 dark:text-green-300">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-extrabold text-gray-950 dark:text-white">AI Suggestions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Role-specific content appears here.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <SuggestionGroup icon={Sparkles} title="Summary Ideas" items={suggestions.summarySuggestions} />
      <SuggestionGroup icon={Wand2} title="Achievement Bullets" items={suggestions.achievementBullets} />
      <SuggestionGroup icon={Lightbulb} title="Keywords" items={suggestions.keywords} />
    </div>
  )
}
