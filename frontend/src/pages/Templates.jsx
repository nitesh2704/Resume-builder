import { useEffect, useMemo, useState } from 'react'
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
  const [selectedId, setSelectedId] = useState(data[0]?.id || '')

  useEffect(() => {
    if (!selectedId && data[0]?.id) {
      setSelectedId(data[0].id)
    }
  }, [data, selectedId])

  useEffect(() => {
    fetchTemplates().catch(() => { })
  }, [])

  const selectedTemplate = useMemo(() => data.find((item) => item.id === selectedId), [data, selectedId])

  const previewClass = (id) => {
    switch (id) {
      case 'canopy':
        return 'from-emerald-50 via-emerald-100 to-lime-100 dark:from-emerald-950 dark:via-gray-950 dark:to-emerald-900'
      case 'moss':
        return 'from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-black'
      case 'forest':
      default:
        return 'from-green-50 via-white to-green-100 dark:from-emerald-950 dark:via-gray-950 dark:to-black'
    }
  }

  const cardPreview = (template) => {
    if (template.id === 'canopy') {
      return (
        <div className="grid h-full grid-cols-[0.45fr_1fr] gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm dark:border-emerald-900 dark:bg-gray-950">
          <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950">
            <div className="h-2 w-10 rounded-full" style={{ backgroundColor: template.accentColor }} />
            <div className="mt-3 space-y-2">
              <div className="h-2 w-full rounded-full bg-emerald-100/70 dark:bg-emerald-900" />
              <div className="h-2 w-10/12 rounded-full bg-emerald-100/70 dark:bg-emerald-900" />
              <div className="h-2 w-8/12 rounded-full bg-emerald-100/70 dark:bg-emerald-900" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-2 w-24 rounded-full bg-gray-100 dark:bg-gray-800" />
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800" />
              <div className="h-2 w-11/12 rounded-full bg-gray-100 dark:bg-gray-800" />
              <div className="h-2 w-9/12 rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-5 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950" />
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (template.id === 'moss') {
      return (
        <div className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <div className="h-2 w-20 rounded-full" style={{ backgroundColor: template.accentColor }} />
            <div className="h-2 w-10 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-2 w-10/12 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-2 w-7/12 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="mt-auto flex gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-4 w-12 rounded-full bg-slate-50 dark:bg-slate-900" />
            ))}
          </div>
        </div>
      )
    }

    return (
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
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-green-200 bg-white/90 p-6 shadow-card dark:border-emerald-900 dark:bg-gray-900/80 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-verdant-primary dark:text-green-300">Templates</p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-950 dark:text-white">Choose a Verdant layout</h2>
        </div>
        <Link to={selectedId ? `/builder?template=${selectedId}` : '/builder'}>
          <Button disabled={!selectedId}>
            <FileText className="h-4 w-4" />
            Use in builder
          </Button>
        </Link>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {data.map((template) => (
          <article
            key={template.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedId(template.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setSelectedId(template.id)
              }
            }}
            className={`group relative overflow-hidden rounded-2xl border bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none dark:bg-gray-900 ${selectedId === template.id
              ? 'border-emerald-400 ring-2 ring-emerald-300 dark:border-emerald-500 dark:ring-emerald-700'
              : 'border-green-200 dark:border-emerald-900'
              }`}
          >
            <div className={`h-40 bg-gradient-to-br p-5 ${previewClass(template.id)}`}>
              {cardPreview(template)}
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
              {selectedId === template.id ? (
                <span className="mt-4 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Selected
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
