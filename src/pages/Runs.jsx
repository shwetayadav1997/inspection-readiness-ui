import { useEffect, useState } from 'react'
import { getRuns, getRun } from '../api'
import { Spinner, PageHeader } from '../components/ui'
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react'

function RunStatusBadge({ status }) {
  const s = (status||'').toLowerCase()
  if (s==='completed')               return <span className="badge-green flex items-center gap-1"><CheckCircle size={10}/>Completed</span>
  if (s==='running'||s==='in_progress') return <span className="badge-amber flex items-center gap-1"><div className="w-2 h-2 border border-amber-500 border-t-transparent rounded-full animate-spin"/>Running</span>
  if (s==='failed')                  return <span className="badge-red flex items-center gap-1"><XCircle size={10}/>Failed</span>
  if (s==='scheduled')               return <span className="badge-gray flex items-center gap-1"><Clock size={10}/>Scheduled</span>
  return <span className="badge-gray">{status}</span>
}

function RunRow({ run }) {
  const [expanded, setExpanded] = useState(false)
  const [detail, setDetail]     = useState(null)
  const [loading, setLoading]   = useState(false)

  const handleExpand = async () => {
    if (!expanded && !detail) {
      setLoading(true)
      try { setDetail(await getRun(run.run_id)) } catch {}
      finally { setLoading(false) }
    }
    setExpanded(!expanded)
  }

  return (
    <>
      <tr className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors cursor-pointer" onClick={handleExpand}>
        <td className="px-4 py-3 text-[#9CA3AF]">
          {expanded ? <ChevronDown size={13}/> : <ChevronRight size={13}/>}
        </td>
        <td className="px-4 py-3 font-mono text-xs text-[#6B7280]">{run.run_id}</td>
        <td className="px-4 py-3">
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
            run.trigger_type==='manual' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>{run.trigger_type==='manual' ? 'Manual' : 'Scheduled'}</span>
        </td>
        <td className="px-4 py-3"><RunStatusBadge status={run.status}/></td>
        <td className="px-4 py-3 text-[#374151] text-xs whitespace-nowrap">{run.started_at ? new Date(run.started_at).toLocaleString() : '—'}</td>
        <td className="px-4 py-3 text-[#6B7280] text-xs whitespace-nowrap">{run.completed_at ? new Date(run.completed_at).toLocaleString() : '—'}</td>
        <td className="px-4 py-3 text-center text-[#374151] text-sm">{run.systems_processed ?? '—'}</td>
        <td className="px-4 py-3 text-center">
          {run.systems_failed > 0
            ? <span className="badge-red">{run.systems_failed}</span>
            : <span className="text-[#10B981] text-xs">0</span>
          }
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
          <td colSpan={8} className="px-6 py-4">
            {loading ? (
              <div className="flex items-center gap-2 text-[#6B7280] text-xs py-2"><Spinner size={4}/> Loading…</div>
            ) : detail ? (
              <div>
                <div className="text-xs font-semibold text-[#6B7280] mb-3 uppercase tracking-wide">System Results</div>
                {detail.system_statuses?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {detail.system_statuses.map((ss, i) => (
                      <div key={i} className="card-sm flex items-center justify-between">
                        <div>
                          <div className="text-xs font-mono text-[#6B7280]">{ss.ci_id}</div>
                          <div className="text-xs text-[#9CA3AF] mt-0.5">{ss.system_name||'—'}</div>
                        </div>
                        <RunStatusBadge status={ss.status}/>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-[#9CA3AF] text-xs">No system status details available</p>}
                {detail.error_log && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600 text-xs font-medium mb-1">
                      <AlertCircle size={12}/> Error Log
                    </div>
                    <pre className="text-xs text-red-500 whitespace-pre-wrap">{detail.error_log}</pre>
                  </div>
                )}
              </div>
            ) : <p className="text-[#9CA3AF] text-xs">No details available</p>}
          </td>
        </tr>
      )}
    </>
  )
}

export default function Runs() {
  const [runs, setRuns]       = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  useEffect(() => {
    getRuns().then(d => setRuns(Array.isArray(d)?d:[])).catch(()=>setRuns([])).finally(()=>setLoading(false))
  }, [])

  const completed = runs.filter(r=>r.status?.toLowerCase()==='completed').length
  const failed    = runs.filter(r=>r.status?.toLowerCase()==='failed').length

  return (
    <div className="max-w-[1280px]">
      <PageHeader title="Run History" subtitle={`${runs.length} total · ${completed} completed · ${failed} failed`} date={today} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total Runs',  value: runs.length, color:'text-[#111827]' },
          { label:'Completed',   value: completed,   color:'text-[#10B981]' },
          { label:'Failed',      value: failed,      color:'text-[#DC2626]' },
          { label:'Scheduled',   value: runs.filter(r=>r.trigger_type==='scheduled').length, color:'text-blue-600' },
        ].map(({label,value,color}) => (
          <div key={label} className="card text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-[#6B7280] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center gap-3 text-[#6B7280] py-12 text-sm"><Spinner size={5}/> Loading…</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <tr>
                <th className="px-4 py-3 w-8"/>
                {['Run ID','Trigger','Status','Started','Completed','Processed','Failed'].map(h=>(
                  <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {runs.length===0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-[#6B7280] text-sm">No runs found</td></tr>
              ) : runs.map(r=><RunRow key={r.run_id} run={r}/>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
