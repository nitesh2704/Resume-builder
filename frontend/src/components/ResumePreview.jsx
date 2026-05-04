import { Mail, MapPin, Phone } from 'lucide-react'

function Section({ title, children, className = '', titleClassName = '', bodyClassName = '' }) {
  return (
    <section className={className || 'mt-6'}>
      <h3 className={titleClassName || 'border-b border-green-200 pb-2 text-xs font-extrabold uppercase text-verdant-primary'}>
        {title}
      </h3>
      <div className={bodyClassName || 'mt-3'}>{children}</div>
    </section>
  )
}

function ContactLine({ icon: Icon, value, className = '' }) {
  if (!value) return null
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Icon className="h-4 w-4" />
      {value}
    </span>
  )
}

function SkillPill({ children, className = '' }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>{children}</span>
}

function ExperienceBlock({ item, index, className = '' }) {
  return (
    <div key={`${item.company}-${index}`} className={className}>
      <div className="flex flex-col justify-between gap-1 sm:flex-row">
        <div>
          <p className="font-bold">{item.role || 'Role'}</p>
          <p className="text-sm font-semibold text-gray-600">{item.company || 'Company'}</p>
        </div>
        <p className="text-sm text-gray-500">{[item.startDate, item.endDate].filter(Boolean).join(' - ')}</p>
      </div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700">
        {(item.achievements || []).filter(Boolean).map((achievement) => (
          <li key={achievement}>{achievement}</li>
        ))}
      </ul>
    </div>
  )
}

function ProjectBlock({ project, index, className = '' }) {
  return (
    <div key={`${project.name}-${index}`} className={className}>
      <p className="font-bold">{project.name || 'Project name'}</p>
      <p className="mt-1 text-sm leading-6 text-gray-700">{project.description}</p>
      {project.technologies?.length ? (
        <p className="mt-1 text-xs font-semibold text-verdant-primary">{project.technologies.join(' / ')}</p>
      ) : null}
    </div>
  )
}

function EducationBlock({ item, index, className = '' }) {
  return (
    <div key={`${item.institution}-${index}`} className={`flex flex-col justify-between gap-1 sm:flex-row ${className}`}>
      <div>
        <p className="font-bold">{item.degree || 'Degree'}</p>
        <p className="text-sm text-gray-600">{item.institution || 'Institution'}</p>
      </div>
      <p className="text-sm text-gray-500">
        {[item.startYear, item.endYear].filter(Boolean).join(' - ')} {item.score ? ` / ${item.score}` : ''}
      </p>
    </div>
  )
}

const themes = {
  forest: {
    shell: 'resume-print print-surface min-h-[760px] rounded-2xl border border-green-200 bg-white p-8 text-gray-950 shadow-card',
    header: 'flex flex-col gap-3 border-b-4 border-verdant-primary pb-5 sm:flex-row sm:items-end sm:justify-between',
    name: 'text-3xl font-extrabold',
    role: 'mt-1 text-base font-semibold text-verdant-primary',
    contact: 'grid gap-1 text-sm text-gray-600',
    title: 'border-b border-green-200 pb-2 text-xs font-extrabold uppercase text-verdant-primary',
    sectionGap: 'mt-6',
    summary: 'text-sm leading-7 text-gray-700',
    skillPill: 'bg-green-50 text-verdant-primary',
    projectTitle: 'font-bold',
    bodyText: 'text-sm leading-6 text-gray-700'
  },
  canopy: {
    shell: 'resume-print print-surface min-h-[760px] rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-8 text-gray-950 shadow-card',
    header: 'grid gap-4 rounded-2xl border border-emerald-200 bg-white/80 p-5 shadow-sm sm:grid-cols-[1.2fr_0.8fr] sm:items-center',
    name: 'text-3xl font-black tracking-tight',
    role: 'mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700',
    contact: 'grid gap-1 justify-start text-sm text-gray-600 sm:justify-end',
    title: 'mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700',
    sectionGap: 'mt-5 rounded-2xl border border-emerald-100 bg-white/85 p-5 shadow-sm',
    summary: 'text-sm leading-7 text-gray-700',
    skillPill: 'bg-emerald-50 text-emerald-700',
    projectTitle: 'font-extrabold',
    bodyText: 'text-sm leading-6 text-gray-700'
  },
  moss: {
    shell: 'resume-print print-surface min-h-[760px] rounded-2xl border border-slate-200 bg-[#f8faf7] p-8 text-gray-950 shadow-card',
    header: 'border-b border-slate-300 pb-6',
    name: 'text-3xl font-semibold tracking-tight',
    role: 'mt-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-600',
    contact: 'mt-4 flex flex-wrap gap-3 text-sm text-gray-600',
    title: 'mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-600',
    sectionGap: 'mt-5 rounded-xl border border-slate-200 bg-white p-5',
    summary: 'text-sm leading-7 text-gray-700',
    skillPill: 'border border-slate-200 bg-slate-50 text-slate-700',
    projectTitle: 'font-bold tracking-tight',
    bodyText: 'text-sm leading-6 text-gray-700'
  }
}

function ForestLayout({ resume, info, skills, theme }) {
  return (
    <div id="resume-preview" className={theme.shell}>
      <header className={theme.header}>
        <div>
          <h2 className={theme.name}>{info.fullName || 'Your Name'}</h2>
          <p className={theme.role}>{resume.targetRole || 'Target Role'}</p>
        </div>
        <div className={theme.contact}>
          <ContactLine icon={Mail} value={info.email} />
          <ContactLine icon={Phone} value={info.phone} />
          <ContactLine icon={MapPin} value={info.location} />
        </div>
      </header>

      <Section title="Profile" titleClassName={theme.title} className={theme.sectionGap} bodyClassName="mt-3">
        <p className={theme.summary}>{resume.summary || 'A concise professional summary will appear here.'}</p>
      </Section>

      <Section title="Skills" titleClassName={theme.title} className={theme.sectionGap} bodyClassName="mt-3">
        <div className="flex flex-wrap gap-2">
          {skills.length ? (
            skills.map((skill) => <SkillPill key={skill} className={theme.skillPill}>{skill}</SkillPill>)
          ) : (
            <span className="text-sm text-gray-500">Add your strongest technical and role-specific skills.</span>
          )}
        </div>
      </Section>

      <Section title="Experience" titleClassName={theme.title} className={theme.sectionGap} bodyClassName="mt-3 space-y-5">
        {(resume.experience || []).map((item, index) => (
          <ExperienceBlock key={`${item.company}-${index}`} item={item} index={index} />
        ))}
      </Section>

      <Section title="Projects" titleClassName={theme.title} className={theme.sectionGap} bodyClassName="mt-3 space-y-4">
        {(resume.projects || []).map((project, index) => (
          <ProjectBlock key={`${project.name}-${index}`} project={project} index={index} />
        ))}
      </Section>

      <Section title="Education" titleClassName={theme.title} className={theme.sectionGap} bodyClassName="mt-3 space-y-3">
        {(resume.education || []).map((item, index) => (
          <EducationBlock key={`${item.institution}-${index}`} item={item} index={index} />
        ))}
      </Section>

      {resume.certifications?.length ? (
        <Section title="Certifications" titleClassName={theme.title} className={theme.sectionGap} bodyClassName="mt-3">
          <p className={theme.bodyText}>{resume.certifications.join(', ')}</p>
        </Section>
      ) : null}
    </div>
  )
}

function CanopyLayout({ resume, info, skills, theme }) {
  return (
    <div id="resume-preview" className={theme.shell}>
      <header className={theme.header}>
        <div>
          <h2 className={theme.name}>{info.fullName || 'Your Name'}</h2>
          <p className={theme.role}>{resume.targetRole || 'Target Role'}</p>
        </div>
        <div className={theme.contact}>
          <ContactLine icon={Mail} value={info.email} className="justify-end" />
          <ContactLine icon={Phone} value={info.phone} className="justify-end" />
          <ContactLine icon={MapPin} value={info.location} className="justify-end" />
        </div>
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="space-y-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
          <Section title="Profile" titleClassName={theme.title} className="m-0" bodyClassName="mt-3">
            <p className={theme.summary}>{resume.summary || 'A concise professional summary will appear here.'}</p>
          </Section>

          <Section title="Skills" titleClassName={theme.title} className="m-0" bodyClassName="mt-3">
            <div className="flex flex-wrap gap-2">
              {skills.length ? (
                skills.map((skill) => <SkillPill key={skill} className={theme.skillPill}>{skill}</SkillPill>)
              ) : (
                <span className="text-sm text-gray-500">Add your strongest technical and role-specific skills.</span>
              )}
            </div>
          </Section>

          <Section title="Education" titleClassName={theme.title} className="m-0" bodyClassName="mt-3 space-y-3">
            {(resume.education || []).map((item, index) => (
              <EducationBlock key={`${item.institution}-${index}`} item={item} index={index} />
            ))}
          </Section>
        </aside>

        <section className="space-y-5">
          <Section title="Experience" titleClassName={theme.title} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm" bodyClassName="mt-3 space-y-5">
            {(resume.experience || []).map((item, index) => (
              <ExperienceBlock key={`${item.company}-${index}`} item={item} index={index} />
            ))}
          </Section>

          <Section title="Projects" titleClassName={theme.title} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm" bodyClassName="mt-3 space-y-4">
            {(resume.projects || []).map((project, index) => (
              <ProjectBlock key={`${project.name}-${index}`} project={project} index={index} />
            ))}
          </Section>

          {resume.certifications?.length ? (
            <Section title="Certifications" titleClassName={theme.title} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm" bodyClassName="mt-3">
              <p className={theme.bodyText}>{resume.certifications.join(', ')}</p>
            </Section>
          ) : null}
        </section>
      </div>
    </div>
  )
}

function MossLayout({ resume, info, skills, theme }) {
  return (
    <div id="resume-preview" className={theme.shell}>
      <header className={theme.header}>
        <h2 className={theme.name}>{info.fullName || 'Your Name'}</h2>
        <p className={theme.role}>{resume.targetRole || 'Target Role'}</p>
        <div className={theme.contact}>
          <ContactLine icon={Mail} value={info.email} />
          <ContactLine icon={Phone} value={info.phone} />
          <ContactLine icon={MapPin} value={info.location} />
        </div>
      </header>

      <Section title="Profile" titleClassName={theme.title} className={theme.sectionGap} bodyClassName="mt-3">
        <p className={theme.summary}>{resume.summary || 'A concise professional summary will appear here.'}</p>
      </Section>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Section title="Skills" titleClassName={theme.title} className="rounded-xl border border-slate-200 bg-white p-5" bodyClassName="mt-3">
          <div className="flex flex-wrap gap-2">
            {skills.length ? (
              skills.map((skill) => <SkillPill key={skill} className={theme.skillPill}>{skill}</SkillPill>)
            ) : (
              <span className="text-sm text-gray-500">Add your strongest technical and role-specific skills.</span>
            )}
          </div>
        </Section>

        <Section title="Education" titleClassName={theme.title} className="rounded-xl border border-slate-200 bg-white p-5" bodyClassName="mt-3 space-y-3">
          {(resume.education || []).map((item, index) => (
            <EducationBlock key={`${item.institution}-${index}`} item={item} index={index} />
          ))}
        </Section>
      </div>

      <Section title="Experience" titleClassName={theme.title} className={theme.sectionGap} bodyClassName="mt-3 space-y-5">
        {(resume.experience || []).map((item, index) => (
          <ExperienceBlock key={`${item.company}-${index}`} item={item} index={index} />
        ))}
      </Section>

      <Section title="Projects" titleClassName={theme.title} className={theme.sectionGap} bodyClassName="mt-3 space-y-4">
        {(resume.projects || []).map((project, index) => (
          <ProjectBlock key={`${project.name}-${index}`} project={project} index={index} />
        ))}
      </Section>

      {resume.certifications?.length ? (
        <Section title="Certifications" titleClassName={theme.title} className={theme.sectionGap} bodyClassName="mt-3">
          <p className={theme.bodyText}>{resume.certifications.join(', ')}</p>
        </Section>
      ) : null}
    </div>
  )
}

export default function ResumePreview({ resume }) {
  const info = resume.personalInfo || {}
  const skills = resume.skills || []
  const templateId = resume.templateId || 'forest'
  const theme = themes[templateId] || themes.forest

  if (templateId === 'canopy') {
    return <CanopyLayout resume={resume} info={info} skills={skills} theme={theme} />
  }

  if (templateId === 'moss') {
    return <MossLayout resume={resume} info={info} skills={skills} theme={theme} />
  }

  return <ForestLayout resume={resume} info={info} skills={skills} theme={theme} />
}
