import { Mail, MapPin, Phone } from 'lucide-react'

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h3 className="border-b border-green-200 pb-2 text-xs font-extrabold uppercase text-verdant-primary">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export default function ResumePreview({ resume }) {
  const info = resume.personalInfo || {}
  const skills = resume.skills || []

  return (
    <div className="resume-print print-surface min-h-[760px] rounded-2xl border border-green-200 bg-white p-8 text-gray-950 shadow-card">
      <header>
        <div className="flex flex-col gap-3 border-b-4 border-verdant-primary pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold">{info.fullName || 'Your Name'}</h2>
            <p className="mt-1 text-base font-semibold text-verdant-primary">{resume.targetRole || 'Target Role'}</p>
          </div>
          <div className="grid gap-1 text-sm text-gray-600">
            {info.email ? (
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-verdant-primary" />
                {info.email}
              </span>
            ) : null}
            {info.phone ? (
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-verdant-primary" />
                {info.phone}
              </span>
            ) : null}
            {info.location ? (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-verdant-primary" />
                {info.location}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <Section title="Profile">
        <p className="text-sm leading-7 text-gray-700">
          {resume.summary || 'A concise professional summary will appear here.'}
        </p>
      </Section>

      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {skills.length ? (
            skills.map((skill) => (
              <span key={skill} className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-verdant-primary">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">Add your strongest technical and role-specific skills.</span>
          )}
        </div>
      </Section>

      <Section title="Experience">
        <div className="space-y-5">
          {(resume.experience || []).map((item, index) => (
            <div key={`${item.company}-${index}`}>
              <div className="flex flex-col justify-between gap-1 sm:flex-row">
                <div>
                  <p className="font-bold">{item.role || 'Role'}</p>
                  <p className="text-sm font-semibold text-gray-600">{item.company || 'Company'}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {[item.startDate, item.endDate].filter(Boolean).join(' - ')}
                </p>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700">
                {(item.achievements || []).filter(Boolean).map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Projects">
        <div className="space-y-4">
          {(resume.projects || []).map((project, index) => (
            <div key={`${project.name}-${index}`}>
              <p className="font-bold">{project.name || 'Project name'}</p>
              <p className="mt-1 text-sm leading-6 text-gray-700">{project.description}</p>
              {project.technologies?.length ? (
                <p className="mt-1 text-xs font-semibold text-verdant-primary">
                  {project.technologies.join(' / ')}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Education">
        <div className="space-y-3">
          {(resume.education || []).map((item, index) => (
            <div key={`${item.institution}-${index}`} className="flex flex-col justify-between gap-1 sm:flex-row">
              <div>
                <p className="font-bold">{item.degree || 'Degree'}</p>
                <p className="text-sm text-gray-600">{item.institution || 'Institution'}</p>
              </div>
              <p className="text-sm text-gray-500">
                {[item.startYear, item.endYear].filter(Boolean).join(' - ')} {item.score ? ` / ${item.score}` : ''}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {resume.certifications?.length ? (
        <Section title="Certifications">
          <p className="text-sm leading-6 text-gray-700">{resume.certifications.join(', ')}</p>
        </Section>
      ) : null}
    </div>
  )
}
