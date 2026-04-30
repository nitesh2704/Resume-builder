import api from './api'

export const resumeService = {
  list: async () => {
    const { data } = await api.get('/resumes')
    return data
  },
  search: async (keyword) => {
    const { data } = await api.get('/resumes/search', { params: { keyword } })
    return data
  },
  get: async (id) => {
    const { data } = await api.get(`/resumes/${id}`)
    return data
  },
  create: async (payload) => {
    const { data } = await api.post('/resumes', payload)
    return data
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/resumes/${id}`, payload)
    return data
  },
  remove: async (id) => {
    await api.delete(`/resumes/${id}`)
  },
  score: async (payload) => {
    const { data } = await api.post('/resumes/score', payload)
    return data
  }
}
