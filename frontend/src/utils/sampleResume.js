export const emptyResume = {
  title: 'Untitled Resume',
  targetRole: 'Backend Developer',
  jobDescription: '',
  templateId: 'forest',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: ''
  },
  summary: '',
  experience: [
    {
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      location: '',
      achievements: ['']
    }
  ],
  education: [
    {
      institution: '',
      degree: '',
      startYear: '',
      endYear: '',
      score: ''
    }
  ],
  projects: [
    {
      name: '',
      description: '',
      link: '',
      technologies: []
    }
  ],
  skills: ['Java', 'Spring Boot', 'MongoDB', 'React'],
  certifications: [],
  matchedKeywords: [],
  atsScore: 0
}

export const demoResume = {
  ...emptyResume,
  title: 'Spring Boot Developer Resume',
  targetRole: 'Backend Developer',
  jobDescription: 'Build secure REST APIs with Spring Boot, MongoDB, JWT authentication, testing, and AI integrations.',
  personalInfo: {
    fullName: 'Demo Student',
    email: 'demo@verdantai.dev',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/demo-student',
    portfolio: 'demo.dev'
  },
  summary:
    'Final-year computer science student building secure Spring Boot APIs, MongoDB data models, and polished React dashboards with measurable project outcomes.',
  experience: [
    {
      company: 'Campus Innovation Lab',
      role: 'Full Stack Developer Intern',
      startDate: 'Jan 2026',
      endDate: 'Apr 2026',
      location: 'Remote',
      achievements: [
        'Built 12 secure REST endpoints with JWT authentication and validation.',
        'Improved resume scoring workflow by matching 20+ job description keywords.',
        'Reduced repeated frontend form code by 35% using reusable React components.'
      ]
    }
  ],
  education: [
    {
      institution: 'VTU Affiliated Engineering College',
      degree: 'B.E. Computer Science and Engineering',
      startYear: '2022',
      endYear: '2026',
      score: '8.7 CGPA'
    }
  ],
  projects: [
    {
      name: 'Verdant AI Resume Builder',
      description: 'AI-powered resume builder with role suggestions, ATS scoring, templates, and PDF export.',
      link: 'github.com/demo/verdant-ai',
      technologies: ['React', 'Spring Boot', 'MongoDB', 'OpenAI API']
    }
  ],
  certifications: ['MongoDB Basics', 'Java Full Stack Development'],
  matchedKeywords: ['spring boot', 'rest api', 'mongodb', 'jwt'],
  atsScore: 86
}
