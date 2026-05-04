import { useEffect, useState } from 'react'
import { Download, Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/Button'
import ResumePreview from '../components/ResumePreview'
import { useResumes } from '../context/ResumeContext'
import { demoResume } from '../utils/sampleResume'

export default function Preview() {
  const { id } = useParams()
  const { fetchResume } = useResumes()
  const [resume, setResume] = useState(demoResume)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchResume(id)
        .then(setResume)
        .catch((err) => setError(err.message))
    }
  }, [id])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="no-print flex flex-col justify-between gap-4 rounded-2xl border border-green-200 bg-white/90 p-5 shadow-card dark:border-emerald-900 dark:bg-gray-900/80 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-verdant-primary dark:text-green-300">Preview</p>
          <h2 className="mt-1 text-3xl font-extrabold text-gray-950 dark:text-white">{resume.title}</h2>
        </div>
        <div className="flex gap-3">
          <Link to={`/builder/${id}`}>
            <Button variant="secondary">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button onClick={() => {
            try {
              const node = document.getElementById('resume-preview')
              if (!node) { window.print(); return }
              const html = node.outerHTML
              const cssNodes = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
              const css = cssNodes.map((n) => n.outerHTML).join('\n')
              const w = window.open('', '_blank', 'width=900,height=1120')
              if (!w) { window.print(); return }
              w.document.open()
              w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Resume</title>${css}</head><body>${html}</body></html>`)
              w.document.close()
              setTimeout(() => { w.focus(); w.print(); w.close() }, 600)
            } catch (e) { console.error(e); window.print() }
          }}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </section>

      {error ? (
        <div className="no-print rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {error}
        </div>
      ) : null}

      <ResumePreview resume={resume} />
    </div>
  )
}
