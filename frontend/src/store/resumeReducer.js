export const initialResumeState = {
  resumes: [],
  selectedResume: null,
  templates: [],
  loading: false,
  error: ''
}

export function resumeReducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: '' }
    case 'ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SET_RESUMES':
      return { ...state, loading: false, resumes: action.payload }
    case 'SET_SELECTED':
      return { ...state, loading: false, selectedResume: action.payload }
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload }
    case 'UPSERT_RESUME': {
      const exists = state.resumes.some((resume) => resume.id === action.payload.id)
      return {
        ...state,
        loading: false,
        selectedResume: action.payload,
        resumes: exists
          ? state.resumes.map((resume) => (resume.id === action.payload.id ? action.payload : resume))
          : [action.payload, ...state.resumes]
      }
    }
    case 'REMOVE_RESUME':
      return {
        ...state,
        loading: false,
        resumes: state.resumes.filter((resume) => resume.id !== action.payload),
        selectedResume: state.selectedResume?.id === action.payload ? null : state.selectedResume
      }
    default:
      return state
  }
}
