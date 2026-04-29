import {
  MOCK_DASHBOARD,
  MOCK_SYSTEMS,
  MOCK_GAPS,
  MOCK_RUNS,
  MOCK_RUN_DETAILS,
  MOCK_NOTIFICATIONS,
  MOCK_SYSTEM_ARTEFACTS,
  MOCK_SYSTEM_CHECKLIST,
  MOCK_SYSTEM_SCORES,
} from './mockData'

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms))

// Dashboard
export const getDashboard = async () => { await delay(); return MOCK_DASHBOARD }

// Systems
export const getSystems = async () => { await delay(); return MOCK_SYSTEMS }
export const getSystem = async (ciId) => { await delay(); return MOCK_SYSTEMS.find(s => s.ci_id === ciId) || null }
export const getSystemArtefacts = async (ciId) => { await delay(); return MOCK_SYSTEM_ARTEFACTS[ciId] || [] }
export const getSystemChecklist = async (ciId) => { await delay(); return MOCK_SYSTEM_CHECKLIST[ciId] || [] }
export const getSystemScore = async (ciId) => { await delay(); return MOCK_SYSTEM_SCORES[ciId] || null }

// Gaps — supports local state mutation via closure so updates persist during the session
let _gaps = MOCK_GAPS.map(g => ({ ...g }))
export const getGaps = async () => { await delay(); return _gaps }
export const updateGap = async (gapId, data) => {
  await delay(200)
  _gaps = _gaps.map(g => g.gap_id === gapId ? { ...g, ...data, updated_at: new Date().toISOString() } : g)
  return _gaps.find(g => g.gap_id === gapId)
}

// Notifications — supports marking read locally
let _notifications = MOCK_NOTIFICATIONS.map(n => ({ ...n }))
export const getNotifications = async () => { await delay(); return _notifications }
export const markNotificationRead = async (id) => {
  await delay(150)
  _notifications = _notifications.map(n => (n.id === id || n.notification_id === id) ? { ...n, read: true } : n)
  return { success: true }
}

// Runs
export const getRuns = async () => { await delay(); return MOCK_RUNS }
export const getRun = async (runId) => { await delay(); return MOCK_RUN_DETAILS[runId] || { run_id: runId, system_statuses: [], error_log: null } }
export const triggerRun = async (ciId) => { await delay(800); return { message: `Run triggered for ${ciId}`, run_id: `RUN-MANUAL-${Date.now()}` } }

// Export — generates a simple CSV download in the absence of a real backend
export const exportSystems = async () => {
  await delay(500)
  const headers = ['CI ID', 'System Name', 'Type', 'Custodian', 'Owner', 'RAG Status', 'Score', 'Open Gaps', 'Last Evaluated']
  const rows = MOCK_SYSTEMS.map(s => [
    s.ci_id, s.system_name, s.system_type, s.custodian, s.owner,
    s.rag_status, s.readiness_score, s.open_gaps, s.last_evaluated,
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'inspection_systems.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}
