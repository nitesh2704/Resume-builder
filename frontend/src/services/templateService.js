import api from './api'

export const templateService = {
  list: async () => {
    const { data } = await api.get('/templates')
    return data
  }
}
