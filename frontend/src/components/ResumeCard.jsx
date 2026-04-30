import { Calendar, FileText, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from './Button'
import ScoreRing from './ScoreRing'

export default function ResumeCard({ resume, onDelete }) {
  const updated = resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Draft'
  const keywords = resume.matchedKeywords?.slice(0, 4) || []

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-green-200/90 bg-white p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-emerald-900 dark:bg-gray-900">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-verdant-primary via-green-400 to-emerald-200" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-verdant-primary dark:bg-emerald-950 dark:text-green-300">
            <FileText className="h-3.5 w-3.5" />
            {resume.targetRole || 'General Role'}
          </div>
          <h3 className="truncate text-lg font-extrabold text-gray-950 dark:text-white">{resume.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{resume.summary}</p>
        </div>
        <ScoreRing score={resume.atsScore || 0} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {keywords.length ? (
          keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-green-300"
            >
              {keyword}
            </span>
          ))
        ) : (
          <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500 dark:border-gray-800">
            Draft
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-green-100 pt-4 dark:border-emerald-950">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          {updated}
        </span>
        <div className="flex items-center gap-2">
          <Link to={`/builder/${resume.id}`}>
            <Button variant="secondary" className="h-10 px-3" title="Edit resume">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="danger" className="h-10 px-3" onClick={() => onDelete(resume.id)} title="Delete resume">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  )
}
