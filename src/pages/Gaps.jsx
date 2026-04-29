import { useEffect, useState } from 'react'
import { getGaps, updateGap } from '../api'
import { SeverityBadge, StatusBadge, Spinner, PageHeader } from '../components/ui'
import { X } from 'lucide-react'

const STATUS_OPTIONS = ['All', 'open', 'in_progress', 'remediated', 'accepted_exception']
const SEV_OPTIONS    = ['All', 'critical', 'high', 'medium', 'low']

function ActionModal({ gap, onClose, onSave }) {
  const [action, setAction]           = useState('remediated')
  const [justification, setJust]      = useState('')
  const [saving, setSaving]           = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try { await onSave(gap.gap_id, { status: action, justification }); onClose() }
    catch {} finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
          <h3 className="text-sm font-semibold text-[#111827]">Update Gap</h3>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#374151] transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="card-sm bg-[#F9FAFB]">
            <div className="text-xs text-[#6B7280] mb-1">Gap</div>
            <div className="text-sm text-[#111827]">{gap.description}</div>
            <div className="flex items-center gap-2 mt-2">
              <SeverityBadge severity={gap.severity} />
              <span className="text-xs text-[#6B7280] font-mono">{gap.ci_id}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#374151] mb-2 font-medium">Action</label>
            <div className="space-y-2">
              {[
                { value: 'remediated',         label: 'Mark as Remediated',    desc: 'Gap has been fixed and verified' },
                { value: 'accepted_exception', label: 'Accept as Exception',   desc: 'Gap accepted with documented justification' },
                { value: 'in_progress',        label: 'Mark In Progress',      desc: 'Work is actively underway' },
              ].map(opt => (
                <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  action === opt.value ? 'border-[#D72027]/30 bg-red-50' : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                }`}>
                  <input type="radio" name="action" value={opt.value} checked={action===opt.value}
                    onChange={e => setAction(e.target.value)} className="mt-0.5 accent-[#D72027]" />
                  <div>
                    <div className="text-sm text-[#111827]">{opt.label}</div>
                    <div className="text-xs text-[#6B7280] mt-0.5">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#374151] mb-1.5 font-medium">
              Justification <span className="text-[#9CA3AF]">(required for exception)</span>
            </label>
            <textarea className="input h-20 resize-none" placeholder="Provide justification…"
              value={justification} onChange={e => setJust(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-[#E5E7EB]">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? <><Spinner size={4} /> Saving…</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Gaps() {
  const [gaps, setGaps]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [statusFilter, setStatus] = useState('All')
  const [sevFilter, setSev]     = useState('All')
  const [selected, setSelected] = useState(null)

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const load = () => {
    setLoading(true)
    getGaps().then(d => setGaps(Array.isArray(d) ? d : [])).catch(() => setGaps([])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleSave = async (gapId, data) => { await updateGap(gapId, data); load() }

  const filtered = gaps.filter(g => {
    const matchStatus = statusFilter === 'All' || g.status === statusFilter
    const matchSev    = sevFilter    === 'All' || g.severity?.toLowerCase() === sevFilter
    return matchStatus && matchSev
  })

  const openCount     = gaps.filter(g => g.status === 'open').length
  const criticalCount = gaps.filter(g => g.severity?.toLowerCase() === 'critical').length

  return (
    <div className="max-w-[1280px]">
      <PageHeader title="Gap Storyboards" subtitle={`${openCount} open · ${criticalCount} critical`} date={today} />

      <div className="flex flex-wrap gap-3 mb-5">
        <div>
          <label className="text-xs text-[#6B7280] block mb-1">Status</label>
          <select className="select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o==='All' ? 'All Statuses' : o.replace('_',' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-[#6B7280] block mb-1">Severity</label>
          <select className="select" value={sevFilter} onChange={e => setSev(e.target.value)}>
            {SEV_OPTIONS.map(o => <option key={o} value={o}>{o==='All' ? 'All Severities' : o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
          </select>
        </div>
        <div className="ml-auto flex items-end">
          <span className="text-xs text-[#6B7280]">{filtered.length} gaps shown</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center gap-3 text-[#6B7280] py-12 text-sm"><Spinner size={5} /> Loading…</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <tr>
                {['System','Description','Severity','Status','Detected','Checklist Item','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-[#6B7280] text-sm">No gaps match your filters</td></tr>
              ) : filtered.map(g => (
                <tr key={g.gap_id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[#D72027]">{g.ci_id}</td>
                  <td className="px-4 py-3 text-[#374151] max-w-xs"><div className="line-clamp-2">{g.description}</div></td>
                  <td className="px-4 py-3 whitespace-nowrap"><SeverityBadge severity={g.severity} /></td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={g.status} /></td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs whitespace-nowrap">
                    {g.detected_at ? new Date(g.detected_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs max-w-[140px] truncate">{g.checklist_item || '—'}</td>
                  <td className="px-4 py-3">
                    {(g.status === 'open' || g.status === 'in_progress') && (
                      <button onClick={() => setSelected(g)} className="btn-link text-xs">Update</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && <ActionModal gap={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
    </div>
  )
}
