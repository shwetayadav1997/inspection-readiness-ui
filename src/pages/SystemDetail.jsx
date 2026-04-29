import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import {
  getSystem, getSystemArtefacts, getSystemChecklist,
  getSystemScore, triggerRun
} from '../api'
import { RAGBadge, ScorePill, SeverityBadge, StatusBadge, Spinner } from '../components/ui'
import { ArrowLeft, ExternalLink, Play, Info, AlertTriangle } from 'lucide-react'

function Tab({ id, label, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-[#D72027] text-[#D72027]'
          : 'border-transparent text-[#6B7280] hover:text-[#374151]'
      }`}
    >
      {label}
    </button>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-[#F3F4F6] text-sm">
      <span className="text-[#6B7280]">{label}</span>
      <span className="text-[#111827] font-medium text-right max-w-[60%] break-all">{value || '—'}</span>
    </div>
  )
}

export default function SystemDetail() {
  const { ciId } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [system, setSystem] = useState(null)
  const [artefacts, setArtefacts] = useState([])
  const [checklist, setChecklist] = useState([])
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [triggering, setTriggering] = useState(false)
  const [triggerMsg, setTriggerMsg] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getSystem(ciId),
      getSystemArtefacts(ciId),
      getSystemChecklist(ciId),
      getSystemScore(ciId),
    ]).then(([sys, arts, chk, scr]) => {
      setSystem(sys)
      setArtefacts(Array.isArray(arts) ? arts : [])
      setChecklist(Array.isArray(chk) ? chk : [])
      setScore(scr)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [ciId])

  const handleRunNow = async () => {
    setTriggering(true)
    setTriggerMsg(null)
    try {
      await triggerRun(ciId)
      setTriggerMsg({ type: 'success', text: 'Run triggered successfully! Check the Runs page for status.' })
    } catch {
      setTriggerMsg({ type: 'error', text: 'Failed to trigger run. Try again.' })
    } finally {
      setTriggering(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-[#6B7280]">
      <Spinner size={6} /> Loading system…
    </div>
  )
  if (!system) return <div className="card text-red-600 text-sm">System not found.</div>

  const radarData = score?.explainability
    ? Object.entries(score.explainability).map(([k, v]) => ({
        subject: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        A: typeof v === 'number' ? v * 10 : parseFloat(v) * 10,
      }))
    : []

  const checkMet        = checklist.filter(c => c.status?.toLowerCase() === 'met').length
  const checkMissing    = checklist.filter(c => c.status?.toLowerCase() === 'missing').length
  const checkIncomplete = checklist.filter(c => c.status?.toLowerCase() === 'incomplete').length

  return (
    <div className="max-w-[1280px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <button onClick={() => navigate('/systems')} className="btn-ghost mb-3 -ml-1 text-xs text-[#6B7280]">
            <ArrowLeft size={13} /> Back to Systems
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-[#111827]">{system.system_name}</h1>
            <span className="font-mono text-xs text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded">{ciId}</span>
            <RAGBadge status={system.rag_status} />
            <ScorePill score={system.readiness_score} />
          </div>
          <p className="text-sm text-[#6B7280] mt-1">
            {system.custodian} · Last checked {system.last_evaluated ? new Date(system.last_evaluated).toLocaleString() : 'N/A'}
          </p>
        </div>
        <button onClick={handleRunNow} disabled={triggering} className="btn-primary flex-shrink-0">
          {triggering ? <><Spinner size={4} /> Running…</> : <><Play size={13} /> Run Now</>}
        </button>
      </div>

      {triggerMsg && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 border ${
          triggerMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          <Info size={14} /> {triggerMsg.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB] mb-5 flex">
        <Tab id="overview"  label="Overview"                       active={tab==='overview'}  onClick={setTab} />
        <Tab id="artefacts" label={`Artefacts (${artefacts.length})`} active={tab==='artefacts'} onClick={setTab} />
        <Tab id="checklist" label={`Checklist (${checklist.length})`} active={tab==='checklist'} onClick={setTab} />
        <Tab id="score"     label="Score & Analysis"               active={tab==='score'}     onClick={setTab} />
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card">
            <h3 className="text-sm font-semibold text-[#111827] mb-3">System Metadata</h3>
            <InfoRow label="CI ID"             value={system.ci_id} />
            <InfoRow label="System Name"       value={system.system_name} />
            <InfoRow label="System Type"       value={system.system_type} />
            <InfoRow label="Custodian"         value={system.custodian} />
            <InfoRow label="Owner"             value={system.owner} />
            <InfoRow label="Validation Status" value={system.validation_status} />
            <InfoRow label="Last Evaluated"    value={system.last_evaluated ? new Date(system.last_evaluated).toLocaleString() : 'N/A'} />
          </div>
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-sm font-semibold text-[#111827] mb-3">Checklist Summary</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Met', count: checkMet, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
                  { label: 'Incomplete', count: checkIncomplete, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
                  { label: 'Missing', count: checkMissing, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
                ].map(({ label, count, bg, border, text }) => (
                  <div key={label} className={`text-center p-3 ${bg} rounded-lg border ${border}`}>
                    <div className={`text-2xl font-bold ${text}`}>{count}</div>
                    <div className={`text-xs ${text} opacity-70 mt-0.5`}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-[#111827] mb-3">Readiness Score</h3>
              {score ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-[#111827]">{parseFloat(score.score).toFixed(1)}</span>
                    <RAGBadge status={score.rag_status} />
                  </div>
                  <div className="text-xs text-[#6B7280]">Coverage: {score.coverage_pct}%</div>
                  <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(parseFloat(score.score)/10)*100}%`,
                        background: score.rag_status?.toLowerCase() === 'green' ? '#10B981'
                          : score.rag_status?.toLowerCase() === 'amber' ? '#F59E0B' : '#DC2626'
                      }}
                    />
                  </div>
                </div>
              ) : <div className="text-[#6B7280] text-sm">No score available</div>}
            </div>
          </div>
        </div>
      )}

      {/* Artefacts */}
      {tab === 'artefacts' && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <tr>
                {['Artefact Name','Category','Type','Status','Source','Link'].map(h => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artefacts.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-[#6B7280] text-sm">No artefacts found</td></tr>
              ) : artefacts.map((a, i) => (
                <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#111827]">{a.artefact_name}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{a.category}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{a.doc_type}</td>
                  <td className="px-4 py-3">
                    <span className={a.approval_status === 'approved' ? 'badge-green' : 'badge-amber'}>
                      {a.approval_status || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">{a.source_system}</td>
                  <td className="px-4 py-3">
                    {a.url ? (
                      <a href={a.url} target="_blank" rel="noopener noreferrer"
                         onClick={e => e.stopPropagation()}
                         className="text-[#D72027] hover:underline flex items-center gap-1 text-xs font-medium">
                        Open <ExternalLink size={11} />
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Checklist */}
      {tab === 'checklist' && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <tr>
                {['Item','Category','Status','Notes'].map(h => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {checklist.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-[#6B7280] text-sm">No checklist items</td></tr>
              ) : checklist.map((c, i) => (
                <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3 text-[#374151] max-w-xs">{c.item_name || c.checklist_item}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">{c.category}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">{c.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Score */}
      {tab === 'score' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Score Breakdown</h3>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 11 }} />
                  <Radar dataKey="A" stroke="#D72027" fill="#D72027" fillOpacity={0.1} strokeWidth={2} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#111827' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : <div className="text-[#6B7280] text-sm text-center py-12">No data</div>}
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Factor Details</h3>
            {score?.explainability ? (
              <div className="space-y-3">
                {Object.entries(score.explainability).map(([k, v]) => {
                  const pct = typeof v === 'number' ? v * 10 : parseFloat(v) * 10
                  return (
                    <div key={k}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[#374151] capitalize">{k.replace(/_/g,' ')}</span>
                        <span className="font-semibold text-[#111827]">{typeof v === 'number' ? v.toFixed(1) : v}</span>
                      </div>
                      <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(pct,100)}%`,
                            background: pct >= 75 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#DC2626'
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : <div className="text-[#6B7280] text-sm">No factor data</div>}
            {score?.missing_elements?.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-semibold text-[#6B7280] mb-2">Missing Elements</h4>
                <ul className="space-y-1">
                  {score.missing_elements.map((el, i) => (
                    <li key={i} className="text-xs text-[#DC2626] flex items-start gap-2">
                      <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" />{el}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

