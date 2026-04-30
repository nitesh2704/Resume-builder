import { useEffect } from 'react'
import { Check, FileText, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useResumes } from '../context/ResumeContext'

const fallbackTemplates = [
  {
    id: 'forest',
    name: 'Forest Professional',
    description: 'Balanced, ATS-friendly layout with green section accents.',
    accentColor: '#1F7A4C',
    tags: ['ATS', 'Professional', 'Balanced']
  },
  {
    id: 'canopy',
    name: 'Canopy Modern',
    description: 'Premium two-column layout for projects, skills, and experience.',
    accentColor: '#4ADE80',
    tags: ['Modern', 'Projects', 'SaaS']
  },
  {
    id: 'moss',
    name: 'Moss Minimal',
    description: 'Simple academic layout for freshers, internships, and final-year projects.',
    accentColor: '#166534',
    tags: ['Fresher', 'Minimal', 'Academic']
  }
]

export default function Templates() {
  const { templates, fetchTemplates } = useResumes()
  const data = templates.length ? templates : fallbackTemplates

  useEffect(() => {
    fetchTemplates().catch(() => {})
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-green-200 bg-white/90 p-6 shadow-card dark:border-emerald-900 dark:bg-gray-900/80 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-verdant-primary dark:text-green-300">Templates</p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-950 dark:text-white">Choose a Verdant layout</h2>
        </div>
        <Link to="/builder">
          <Button>
            <FileText className="h-4 w-4" />
            Use in builder
          </Button>
        </Link>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {data.map((template) => (
          <article
            key={template.id}
            className="group overflow-hidden rounded-2xl border border-green-200 bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-emerald-900 dark:bg-gray-900"
          >
            <div className="h-36 bg-gradient-to-br from-green-50 via-white to-green-100 p-5 dark:from-emerald-950 dark:via-gray-950 dark:to-black">
              <div className="h-full rounded-2xl border border-green-200 bg-white p-4 shadow-sm dark:border-emerald-900 dark:bg-gray-950">
                <div className="h-3 w-28 rounded-full" style={{ backgroundColor: template.accentColor }} />
                <div className="mt-4 grid gap-2">
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800" />
                  <div className="h-2 w-9/12 rounded-full bg-gray-100 dark:bg-gray-800" />
                  <div className="h-2 w-7/12 rounded-full bg-gray-100 dark:bg-gray-800" />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-5 rounded-full bg-green-50 dark:bg-emerald-950" />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4 text-verdant-primary dark:text-green-300" />
                <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">{template.name}</h3>
              </div>
              <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">{template.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-verdant-primary dark:bg-emerald-950 dark:text-green-300"
                  >
                    <Check className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
