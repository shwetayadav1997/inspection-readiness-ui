import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})

// Dashboard
export const getDashboard = () => api.get('/dashboard').then(r => r.data)

// Systems
export const getSystems = (params = {}) => api.get('/systems', { params }).then(r => r.data)
export const getSystem = (ciId) => api.get(`/systems/${ciId}`).then(r => r.data)
export const getSystemArtefacts = (ciId) => api.get(`/systems/${ciId}/artefacts`).then(r => r.data)
export const getSystemChecklist = (ciId) => api.get(`/systems/${ciId}/checklist`).then(r => r.data)
export const getSystemScore = (ciId) => api.get(`/systems/${ciId}/score`).then(r => r.data)

// Gaps
export const getGaps = (params = {}) => api.get('/gaps', { params }).then(r => r.data)
export const updateGap = (gapId, data) => api.patch(`/gaps/${gapId}`, data).then(r => r.data)

// Notifications
export const getNotifications = () => api.get('/notifications').then(r => r.data)
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`).then(r => r.data)

// Runs
export const getRuns = () => api.get('/runs').then(r => r.data)
export const getRun = (runId) => api.get(`/runs/${runId}`).then(r => r.data)
export const triggerRun = (ciId) => api.post(`/runs/trigger/${ciId}`).then(r => r.data)

// Export
export const exportSystems = () =>
  api.get('/export/systems', { responseType: 'blob' }).then(r => {
    const url = window.URL.createObjectURL(new Blob([r.data]))
    const a = document.createElement('a')
    a.href = url
    a.download = 'inspection_systems.xlsx'
    a.click()
    window.URL.revokeObjectURL(url)
  })

export default api
