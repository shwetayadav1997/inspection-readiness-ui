import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSystems, exportSystems } from '../api'
import { RAGBadge, ScorePill, Spinner, PageHeader } from '../components/ui'
import { Search, Download, ArrowRight } from 'lucide-react'

const RAG_OPTIONS = ['All', 'Green', 'Amber', 'Red']

export default function Systems() {
  const [systems, setSystems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [ragFilter, setRagFilter] = useState('All')
  const [exporting, setExporting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getSystems()
      .then(data => setSystems(Array.isArray(data) ? data : []))
      .catch(() => setSystems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = systems.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || (
      s.system_name?.toLowerCase().includes(q) ||
      s.ci_id?.toLowerCase().includes(q) ||
      s.custodian?.toLowerCase().includes(q) ||
      s.owner?.toLowerCase().includes(q)
    )
    const matchRag = ragFilter === 'All' || s.rag_status?.toLowerCase() === ragFilter.toLowerCase()
    return matchSearch && matchRag
  })

  const handleExport = async () => {
    setExporting(true)
    try { await exportSystems() } catch {}
    finally { setExporting(false) }
  }

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="max-w-[1280px]">
      <PageHeader
        title="Systems"
        subtitle={`${filtered.length} of ${systems.length} systems`}
        date={today}
        actions={
          <button onClick={handleExport} disabled={exporting} className="btn-secondary">
            <Download size={14} />
            {exporting ? 'Exporting…' : 'Export .xlsx'}
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            className="input pl-9"
            placeholder="Search by name, CI ID, custodian, owner…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 bg-[#F3F4F6] rounded-lg p-1 border border-[#E5E7EB]">
          {RAG_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => setRagFilter(opt)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                ragFilter === opt
                  ? 'bg-[#D72027] text-white shadow-sm'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-[#6B7280] text-sm py-16 justify-center">
          <Spinner size={5} /> Loading…
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <tr>
                  {['CI ID', 'System Name', 'Type', 'Custodian', 'Owner', 'RAG', 'Score', 'Open Gaps', 'Last Evaluated', ''].map(h => (
                    <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-[#6B7280] text-sm">
                      No systems match your filters
                    </td>
                  </tr>
                ) : filtered.map(s => (
                  <tr
                    key={s.ci_id}
                    className="table-row-hover border-b border-[#F3F4F6]"
                    onClick={() => navigate(`/systems/${s.ci_id}`)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#6B7280]">{s.ci_id}</td>
                    <td className="px-4 py-3 font-medium text-[#111827]">{s.system_name}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs">{s.system_type || '—'}</td>
                    <td className="px-4 py-3 text-[#374151]">{s.custodian}</td>
                    <td className="px-4 py-3 text-[#374151]">{s.owner}</td>
                    <td className="px-4 py-3"><RAGBadge status={s.rag_status} /></td>
                    <td className="px-4 py-3"><ScorePill score={s.readiness_score} /></td>
                    <td className="px-4 py-3 text-center">
                      {s.open_gaps > 0
                        ? <span className="font-semibold text-[#DC2626]">{s.open_gaps}</span>
                        : <span className="text-[#10B981]">0</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs whitespace-nowrap">
                      {s.last_evaluated ? new Date(s.last_evaluated).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <ArrowRight size={14} className="text-[#D1D5DB]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
