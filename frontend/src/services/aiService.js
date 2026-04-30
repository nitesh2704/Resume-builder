import api from './api'

export const aiService = {
  suggestions: async (payload) => {
    const { data } = await api.post('/ai/suggestions', payload)
    return data
  },
  grammar: async (payload) => {
    const { data } = await api.post('/ai/grammar', payload)
    return data
  }
}
