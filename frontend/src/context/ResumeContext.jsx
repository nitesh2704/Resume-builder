import { createContext, useContext, useMemo, useReducer } from 'react'
import { initialResumeState, resumeReducer } from '../store/resumeReducer'
import { resumeService } from '../services/resumeService'
import { templateService } from '../services/templateService'

const ResumeContext = createContext(null)

export function ResumeProvider({ children }) {
  const [state, dispatch] = useReducer(resumeReducer, initialResumeState)

  const run = async (callback) => {
    dispatch({ type: 'LOADING' })
    try {
      return await callback()
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message })
      throw error
    }
  }

  const fetchResumes = async () =>
    run(async () => {
      const resumes = await resumeService.list()
      dispatch({ type: 'SET_RESUMES', payload: resumes })
      return resumes
    })

  const searchResumes = async (keyword) =>
    run(async () => {
      const resumes = await resumeService.search(keyword)
      dispatch({ type: 'SET_RESUMES', payload: resumes })
      return resumes
    })

  const fetchResume = async (id) =>
    run(async () => {
      const resume = await resumeService.get(id)
      dispatch({ type: 'SET_SELECTED', payload: resume })
      return resume
    })

  const saveResume = async (payload, id) =>
    run(async () => {
      const resume = id ? await resumeService.update(id, payload) : await resumeService.create(payload)
      dispatch({ type: 'UPSERT_RESUME', payload: resume })
      return resume
    })

  const deleteResume = async (id) =>
    run(async () => {
      await resumeService.remove(id)
      dispatch({ type: 'REMOVE_RESUME', payload: id })
    })

  const fetchTemplates = async () => {
    const templates = await templateService.list()
    dispatch({ type: 'SET_TEMPLATES', payload: templates })
    return templates
  }

  const value = useMemo(
    () => ({
      ...state,
      fetchResumes,
      searchResumes,
      fetchResume,
      saveResume,
      deleteResume,
      fetchTemplates
    }),
    [state]
  )

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResumes() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResumes must be used inside ResumeProvider')
  }
  return context
}
