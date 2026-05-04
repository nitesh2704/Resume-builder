import { useEffect, useMemo } from 'react'
import { FilePlus2, Files, Search, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import ResumeCard from '../components/ResumeCard'
import ScoreRing from '../components/ScoreRing'
import { useResumes } from '../context/ResumeContext'

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-emerald-900 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-950 dark:text-white">{value}</p>
        </div>
        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
          <Icon className="h-6 w-6" />
        </span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { resumes, loading, error, fetchResumes, searchResumes, deleteResume } = useResumes()

  useEffect(() => {
    fetchResumes().catch(() => { })
  }, [])

  const stats = useMemo(() => {
    const average = resumes.length
      ? Math.round(resumes.reduce((sum, resume) => sum + (resume.atsScore || 0), 0) / resumes.length)
      : 0
    const keywords = new Set(resumes.flatMap((resume) => resume.matchedKeywords || []))
    return { average, keywords: keywords.size }
  }, [resumes])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon={Files}
          label="Saved resumes"
          value={resumes.length}
          accent="bg-green-100 text-verdant-primary dark:bg-emerald-950 dark:text-green-300"
        />
        <StatCard
          icon={Target}
          label="Average score"
          value={`${stats.average}%`}
          accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
        />
        <StatCard
          icon={Sparkles}
          label="Matched keywords"
          value={stats.keywords}
          accent="bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300"
        />
      </section>

      <section className="rounded-2xl border border-green-200 bg-white/90 p-5 shadow-card backdrop-blur-xl dark:border-emerald-900 dark:bg-gray-900/80">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Resume Workspace</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Search, score, edit, and export your latest drafts.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center rounded-full border border-green-200 bg-white px-4 py-2 dark:border-emerald-900 dark:bg-gray-950 md:hidden">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search resumes"
                onChange={(event) => searchResumes(event.target.value)}
                className="w-full bg-transparent px-3 py-1 text-sm outline-none dark:text-white"
              />
            </div>
            <Link to="/builder">
              <Button className="w-full sm:w-auto">
                <FilePlus2 className="h-4 w-4" />
                New resume
              </Button>
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-green-100 bg-green-50 dark:border-emerald-950 dark:bg-gray-950"
              />
            ))}
          </div>
        ) : resumes.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={deleteResume} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-green-300 bg-green-50/70 p-8 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
            <ScoreRing score={0} size="lg" />
            <h3 className="mt-5 text-xl font-extrabold text-gray-950 dark:text-white">No resumes yet</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              Create the first resume draft and connect it to role-specific suggestions.
            </p>
            <Link to="/builder" className="mt-5">
              <Button>
                <FilePlus2 className="h-4 w-4" />
                Start builder
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
