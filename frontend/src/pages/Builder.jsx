import { useEffect, useMemo, useState } from 'react'
import { FieldArray, Form, Formik } from 'formik'
import { Download, Plus, Save, Sparkles, Trash2, Wand2 } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import AISuggestionsPanel from '../components/AISuggestionsPanel'
import AiResumeChatbot from '../components/AiResumeChatbot'
import Button from '../components/Button'
import FormField from '../components/FormField'
import ResumePreview from '../components/ResumePreview'
import ScoreRing from '../components/ScoreRing'
import { useResumes } from '../context/ResumeContext'
import { aiService } from '../services/aiService'
import { resumeService } from '../services/resumeService'
import { emptyResume } from '../utils/sampleResume'

const schema = Yup.object({
  title: Yup.string().required('Title is required'),
  targetRole: Yup.string().required('Target role is required'),
  personalInfo: Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Use a valid email').required('Email is required')
  }),
  summary: Yup.string().min(30, 'Add a stronger summary').required('Summary is required')
})

function toText(items) {
  return (items || []).join(', ')
}

function linesToArray(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function commaToArray(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeForForm(resume) {
  return {
    ...emptyResume,
    ...resume,
    personalInfo: { ...emptyResume.personalInfo, ...(resume.personalInfo || {}) },
    skillsText: toText(resume.skills || emptyResume.skills),
    certificationsText: toText(resume.certifications || []),
    experience: (resume.experience?.length ? resume.experience : emptyResume.experience).map((item) => ({
      ...item,
      achievementText: (item.achievements || []).join('\n')
    })),
    projects: (resume.projects?.length ? resume.projects : emptyResume.projects).map((item) => ({
      ...item,
      technologyText: toText(item.technologies || [])
    }))
  }
}

function toPayload(values) {
  return {
    title: values.title,
    targetRole: values.targetRole,
    jobDescription: values.jobDescription,
    templateId: values.templateId,
    personalInfo: values.personalInfo,
    summary: values.summary,
    skills: commaToArray(values.skillsText || ''),
    certifications: commaToArray(values.certificationsText || ''),
    experience: values.experience.map((item) => ({
      company: item.company,
      role: item.role,
      startDate: item.startDate,
      endDate: item.endDate,
      location: item.location,
      achievements: linesToArray(item.achievementText || '')
    })),
    education: values.education,
    projects: values.projects.map((item) => ({
      name: item.name,
      description: item.description,
      link: item.link,
      technologies: commaToArray(item.technologyText || '')
    }))
  }
}

function previewFromValues(values, score) {
  const payload = toPayload(values)
  return {
    ...payload,
    atsScore: score?.score || values.atsScore || 0,
    matchedKeywords: score?.matchedKeywords || values.matchedKeywords || []
  }
}

export default function Builder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { fetchResume, saveResume, loading } = useResumes()
  const [initialValues, setInitialValues] = useState(normalizeForForm(emptyResume))
  const [suggestions, setSuggestions] = useState(null)
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  const [fillLoading, setFillLoading] = useState(false)
  const [score, setScore] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      const templateId = searchParams.get('template') || emptyResume.templateId
      setInitialValues(normalizeForForm({ ...emptyResume, templateId }))
      return
    }

    fetchResume(id)
      .then((resume) => setInitialValues(normalizeForForm(resume)))
      .catch((err) => setError(err.message))
  }, [id, searchParams])

  const pageTitle = useMemo(() => (id ? 'Edit resume' : 'Create resume'), [id])

  const exportResumePdf = () => {
    try {
      const node = document.getElementById('resume-preview')
      if (!node) {
        window.print()
        return
      }

      const html = node.outerHTML
      const cssNodes = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      const css = cssNodes.map((n) => n.outerHTML).join('\n')

      const printWindow = window.open('', '_blank', 'width=900,height=1120')
      if (!printWindow) {
        window.print()
        return
      }

      printWindow.document.open()
      printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Resume</title>${css}</head><body>${html}</body></html>`)
      printWindow.document.close()

      // Wait for styles to load
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }, 600)
    } catch (err) {
      console.error('Export failed, falling back to window.print()', err)
      window.print()
    }
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-green-200 bg-white/90 p-5 shadow-card dark:border-emerald-900 dark:bg-verdant-dark-panel/80 xl:flex-row xl:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-verdant-primary dark:text-green-300">{pageTitle}</p>
          <h2 className="mt-1 text-3xl font-extrabold text-gray-950 dark:text-white">
            Build, score, and refine with AI
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <ScoreRing score={score?.score || initialValues.atsScore || 0} />
          <Button variant="secondary" onClick={exportResumePdf}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {error}
        </div>
      ) : null}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values) => {
          setError('')
          try {
            const saved = await saveResume(toPayload(values), id)
            navigate(`/builder/${saved.id}`)
          } catch (err) {
            setError(err.message)
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
          const preview = previewFromValues(values, score)

          const generateSuggestions = async () => {
            setSuggestionLoading(true)
            setError('')
            try {
              const result = await aiService.suggestions({
                targetRole: values.targetRole,
                jobDescription: values.jobDescription,
                currentSummary: values.summary,
                skills: commaToArray(values.skillsText || ''),
                achievements: values.experience.flatMap((item) => linesToArray(item.achievementText || ''))
              })
              setSuggestions(result)
            } catch (err) {
              setError(err.message)
            } finally {
              setSuggestionLoading(false)
            }
          }

          const polishSummary = async () => {
            setError('')
            try {
              const result = await aiService.grammar({ text: values.summary })
              setFieldValue('summary', result.correctedText)
            } catch (err) {
              setError(err.message)
            }
          }

          const calculateScore = async () => {
            setError('')
            try {
              const result = await resumeService.score({
                targetRole: values.targetRole,
                jobDescription: values.jobDescription,
                summary: values.summary,
                skills: commaToArray(values.skillsText || ''),
                bullets: values.experience.flatMap((item) => linesToArray(item.achievementText || ''))
              })
              setScore(result)
            } catch (err) {
              setError(err.message)
            }
          }

          const applyAiResume = (data) => {
            if (!data) {
              return
            }

            // Avoid filling personal details (name, email, phone, location, linkedin, portfolio)
            // Only fill professional content
            setFieldValue('targetRole', data.role || '')
            setFieldValue('summary', data.summary || '')
            setFieldValue('skillsText', (data.skills || []).join(', '))

            // Map experience with all extracted fields
            const experience = (data.experience || []).map((item) => ({
              company: item.company || '',
              role: item.role || '',
              startDate: item.startDate || '',
              endDate: item.endDate || '',
              location: item.location || '',
              achievementText: (item.achievements || []).join('\n')
            }))

            // Map projects with all extracted fields
            const projects = (data.projects || []).map((item) => ({
              name: item.name || '',
              description: item.description || '',
              link: item.link || '',
              technologyText: (item.technologies || []).join(', ')
            }))

            // Map education with all extracted fields
            const education = (data.education || []).map((item) => ({
              institution: item.institution || '',
              degree: item.degree || '',
              startYear: item.startYear || '',
              endYear: item.endYear || '',
              score: item.score || ''
            }))

            if (experience.length) {
              setFieldValue('experience', experience)
            }

            if (projects.length) {
              setFieldValue('projects', projects)
            }

            if (education.length) {
              setFieldValue('education', education)
            }
          }

          const handleFillWithAi = async () => {
            setError('')
            setFillLoading(true)
            try {
              const input = values.summary || values.targetRole || ''
              const result = await aiService.generateResume({ input })
              applyAiResume(result)
            } catch (err) {
              setError(err.message)
            } finally {
              setFillLoading(false)
            }
          }

          return (
            <Form className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(520px,1fr)]">
              <div className="space-y-6">
                <section className="verdant-panel rounded-2xl p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      label="Resume title"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.title && errors.title}
                    />
                    <FormField
                      label="Target role"
                      name="targetRole"
                      value={values.targetRole}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.targetRole && errors.targetRole}
                    />
                    <FormField
                      label="Template"
                      as="select"
                      name="templateId"
                      value={values.templateId}
                      onChange={handleChange}
                      className="md:col-span-2"
                    >
                      <option value="forest">Forest Professional</option>
                      <option value="canopy">Canopy Modern</option>
                      <option value="moss">Moss Minimal</option>
                    </FormField>
                    <FormField
                      label="Job description"
                      as="textarea"
                      rows="4"
                      name="jobDescription"
                      value={values.jobDescription}
                      onChange={handleChange}
                      className="md:col-span-2"
                    />
                  </div>
                </section>

                <section className="verdant-panel rounded-2xl p-5">
                  <h3 className="mb-4 text-lg font-extrabold text-gray-950 dark:text-white">Personal Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      ['Full name', 'personalInfo.fullName'],
                      ['Email', 'personalInfo.email'],
                      ['Phone', 'personalInfo.phone'],
                      ['Location', 'personalInfo.location'],
                      ['LinkedIn', 'personalInfo.linkedin'],
                      ['Portfolio', 'personalInfo.portfolio']
                    ].map(([label, name]) => (
                      <FormField
                        key={name}
                        label={label}
                        name={name}
                        value={name.split('.').reduce((acc, key) => acc?.[key], values)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          name === 'personalInfo.fullName'
                            ? touched.personalInfo?.fullName && errors.personalInfo?.fullName
                            : name === 'personalInfo.email'
                              ? touched.personalInfo?.email && errors.personalInfo?.email
                              : ''
                        }
                      />
                    ))}
                  </div>
                </section>

                <section className="verdant-panel rounded-2xl p-5">
                  <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">Profile and Skills</h3>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={handleFillWithAi} loading={fillLoading}>
                        <Sparkles className="h-4 w-4" />
                        Fill with AI
                      </Button>
                      <Button variant="secondary" onClick={polishSummary}>
                        <Wand2 className="h-4 w-4" />
                        Polish
                      </Button>
                      <Button variant="secondary" onClick={calculateScore}>
                        Score
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <FormField
                      label="Summary"
                      as="textarea"
                      rows="5"
                      name="summary"
                      value={values.summary}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.summary && errors.summary}
                    />
                    <FormField
                      label="Skills"
                      name="skillsText"
                      value={values.skillsText}
                      onChange={handleChange}
                    />
                    <FormField
                      label="Certifications"
                      name="certificationsText"
                      value={values.certificationsText}
                      onChange={handleChange}
                    />
                  </div>
                </section>

                <FieldArray name="experience">
                  {({ push, remove }) => (
                    <section className="verdant-panel rounded-2xl p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">Experience</h3>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            push({
                              company: '',
                              role: '',
                              startDate: '',
                              endDate: '',
                              location: '',
                              achievementText: ''
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-5">
                        {values.experience.map((item, index) => (
                          <div key={index} className="rounded-2xl border border-green-100 p-4 dark:border-emerald-950">
                            <div className="mb-4 flex justify-end">
                              {values.experience.length > 1 ? (
                                <Button variant="danger" className="h-10 px-3" onClick={() => remove(index)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              ) : null}
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                              <FormField label="Company" name={`experience.${index}.company`} value={item.company} onChange={handleChange} />
                              <FormField label="Role" name={`experience.${index}.role`} value={item.role} onChange={handleChange} />
                              <FormField label="Start" name={`experience.${index}.startDate`} value={item.startDate} onChange={handleChange} />
                              <FormField label="End" name={`experience.${index}.endDate`} value={item.endDate} onChange={handleChange} />
                              <FormField label="Location" name={`experience.${index}.location`} value={item.location} onChange={handleChange} />
                              <FormField
                                label="Achievements"
                                as="textarea"
                                rows="4"
                                name={`experience.${index}.achievementText`}
                                value={item.achievementText}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </FieldArray>

                <section className="verdant-panel rounded-2xl p-5">
                  <h3 className="mb-4 text-lg font-extrabold text-gray-950 dark:text-white">Education</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField label="Institution" name="education.0.institution" value={values.education[0]?.institution || ''} onChange={handleChange} />
                    <FormField label="Degree" name="education.0.degree" value={values.education[0]?.degree || ''} onChange={handleChange} />
                    <FormField label="Start year" name="education.0.startYear" value={values.education[0]?.startYear || ''} onChange={handleChange} />
                    <FormField label="End year" name="education.0.endYear" value={values.education[0]?.endYear || ''} onChange={handleChange} />
                    <FormField label="Score" name="education.0.score" value={values.education[0]?.score || ''} onChange={handleChange} className="md:col-span-2" />
                  </div>
                </section>

                <FieldArray name="projects">
                  {({ push, remove }) => (
                    <section className="verdant-panel rounded-2xl p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">Projects</h3>
                        <Button
                          variant="secondary"
                          onClick={() => push({ name: '', description: '', link: '', technologyText: '' })}
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-5">
                        {values.projects.map((project, index) => (
                          <div key={index} className="rounded-2xl border border-green-100 p-4 dark:border-emerald-950">
                            <div className="mb-4 flex justify-end">
                              {values.projects.length > 1 ? (
                                <Button variant="danger" className="h-10 px-3" onClick={() => remove(index)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              ) : null}
                            </div>
                            <div className="grid gap-4">
                              <FormField label="Project name" name={`projects.${index}.name`} value={project.name} onChange={handleChange} />
                              <FormField label="Description" as="textarea" rows="3" name={`projects.${index}.description`} value={project.description} onChange={handleChange} />
                              <FormField label="Technologies" name={`projects.${index}.technologyText`} value={project.technologyText} onChange={handleChange} />
                              <FormField label="Link" name={`projects.${index}.link`} value={project.link} onChange={handleChange} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </FieldArray>

                <div className="sticky bottom-4 z-10 flex gap-3 rounded-full border border-green-200 bg-white/90 p-2 shadow-card backdrop-blur dark:border-emerald-900 dark:bg-verdant-dark-panel/90">
                  <Button type="submit" className="flex-1" loading={loading}>
                    <Save className="h-4 w-4" />
                    Save resume
                  </Button>
                  <Button variant="secondary" onClick={generateSuggestions} loading={suggestionLoading}>
                    <Sparkles className="h-4 w-4" />
                    AI
                  </Button>
                </div>
              </div>

              <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
                <ResumePreview resume={preview} />
                <AISuggestionsPanel suggestions={suggestions} loading={suggestionLoading} />
                {score ? (
                  <div className="verdant-panel rounded-2xl p-5">
                    <h3 className="mb-3 text-lg font-extrabold text-gray-950 dark:text-white">JD Match</h3>
                    <div className="flex flex-wrap gap-2">
                      {score.matchedKeywords.map((keyword) => (
                        <span key={keyword} className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-verdant-primary dark:bg-emerald-950 dark:text-green-300">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {score.recommendations.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </aside>
              <AiResumeChatbot onApply={applyAiResume} />
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
