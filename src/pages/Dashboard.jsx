import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { getDashboard } from '../api'
import { RAGBadge, ScorePill, Spinner, PageHeader, SectionHeader } from '../components/ui'
import { TrendingUp, ArrowRight, Calendar } from 'lucide-react'

/* ── Circular progress SVG ──────────────────────────── */
function CircularProgress({ pct, size = 160, stroke = 18 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke="#C77F3E" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

/* ── KPI card ────────────────────────────────────────── */
function KpiCard({ label, value, sub }) {
  return (
    <div className="card">
      <div className="text-xs text-[#6B7280] mb-2">{label}</div>
      <div className="text-3xl font-bold text-[#111827]">{value}</div>
      {sub && <div className="text-xs text-[#6B7280] mt-1">{sub}</div>}
    </div>
  )
}

/* ── Status mini card ────────────────────────────────── */
function StatusCard({ dot, label, count, detail }) {
  return (
    <div className="card flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-2">
        {dot && <span className={`w-2 h-2 rounded-full flex-shrink-0`} style={{ background: dot }} />}
        <span className="text-[11px] text-[#6B7280] uppercase tracking-wide truncate">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[#111827]">{count}</div>
      {detail && <div className="text-[11px] text-[#6B7280] mt-0.5">{detail}</div>}
    </div>
  )
}

const RAG_COLORS = { green: '#10B981', amber: '#F59E0B', red: '#DC2626' }

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="card-sm text-xs shadow-md">
        <div className="font-medium text-[#111827]">{payload[0].payload.name}</div>
        <div className="text-[#6B7280] mt-1">Score: <span className="font-semibold text-[#111827]">{payload[0].value}</span></div>
      </div>
    )
  }
  return null
}

const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-[#6B7280]">
      <Spinner size={6} /><span className="text-sm">Loading…</span>
    </div>
  )

  const systems = data?.systems || []
  const ragCounts = {
    green: systems.filter(s => s.rag_status?.toLowerCase() === 'green').length,
    amber: systems.filter(s => s.rag_status?.toLowerCase() === 'amber').length,
    red:   systems.filter(s => s.rag_status?.toLowerCase() === 'red').length,
  }
  const totalGaps    = systems.reduce((a, s) => a + (s.open_gaps || 0), 0)
  const criticalGaps = systems.filter(s => s.rag_status?.toLowerCase() === 'red').reduce((a, s) => a + (s.open_gaps || 0), 0)
  const atRisk       = ragCounts.red + ragCounts.amber
  const coveragePct  = 82 // representative from design

  const barData = systems.map(s => ({
    name: s.system_name?.length > 12 ? s.system_name.slice(0, 12) + '…' : s.system_name,
    score: parseFloat(s.readiness_score || 0),
    rag: s.rag_status?.toLowerCase(),
  }))

  // Mini trend line data (simulated)
  const trendData = [
    { v: 74 }, { v: 76 }, { v: 75 }, { v: 78 }, { v: 80 }, { v: 82 },
  ]

  return (
    <div className="max-w-[1280px]">
      <PageHeader
        title="Inspection Readiness Overview"
        subtitle="Monitor GxP system readiness, track gaps, and manage inspection preparation across all in-scope systems."
        date={today}
        actions={null}
      />

      {/* ── Row 1: Coverage card + KPIs ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Coverage */}
        <div className="card flex flex-col">
          <div className="section-title mb-4">Overall Readiness Coverage</div>
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <CircularProgress pct={coveragePct} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#111827]">{coveragePct}%</span>
                <span className="text-[9px] font-semibold text-[#6B7280] uppercase tracking-widest mt-0.5">Coverage</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#374151]">
                <span className="font-semibold">{Math.round(coveragePct * 2.25)} of 225</span> required artifacts available
              </p>
              <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1">
                <TrendingUp size={11} className="text-[#C77F3E]" /> +4 pts vs 30 days ago
              </p>
              <div className="mt-3 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <Line type="monotone" dataKey="v" stroke="#C77F3E" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-1">
                <span>Mar 25</span><span>Apr {new Date().getDate()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 KPIs */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <KpiCard label="Total Systems" value={systems.length} sub={`${systems.length} in scope`} />
          <KpiCard label="Systems at Risk" value={atRisk} sub=">5% lag · Critical + At Risk" />
          <KpiCard label="Open Gaps" value={totalGaps} sub={`~${(totalGaps / Math.max(systems.length, 1)).toFixed(1)} per system avg`} />
          <KpiCard label="Critical Gaps" value={criticalGaps} sub="stable, immediate action" />
        </div>
      </div>

      {/* ── Row 2: Status cards ─────────────────────────── */}
      <div className="mb-6">
        <SectionHeader
          title="Trials by Readiness Status"
          action={() => navigate('/systems')}
          actionLabel="Open Systems"
        />
        <p className="text-xs text-[#6B7280] mb-3">
          Systems grouped by current RAG status. Scores 7.5–10 = Ready, 5–7.4 = At Risk, below 5 = Critical.
        </p>
        <div className="flex gap-3 flex-wrap">
          <StatusCard label="Total Systems" count={systems.length} detail={`${systems.length} in scope`} />
          <StatusCard dot="#DC2626" label="Critical" count={ragCounts.red} detail={`${((ragCounts.red/Math.max(systems.length,1))*100).toFixed(1)}%`} />
          <StatusCard dot="#F59E0B" label="At Risk" count={ragCounts.amber} detail={`${((ragCounts.amber/Math.max(systems.length,1))*100).toFixed(1)}%`} />
          <StatusCard dot="#FB923C" label="Needs Review" count={0} detail="70~46%" />
          <StatusCard dot="#10B981" label="Ready" count={ragCounts.green} detail={`${((ragCounts.green/Math.max(systems.length,1))*100).toFixed(1)}%`} />
        </div>
      </div>

      {/* ── Row 3: Score bar chart ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        <div className="card lg:col-span-3">
          <SectionHeader title="System Readiness Scores" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} barSize={30}>
              <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={RAG_COLORS[entry.rag] || '#9CA3AF'} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RAG breakdown */}
        <div className="card lg:col-span-2">
          <SectionHeader title="RAG Distribution" />
          <div className="space-y-4 mt-2">
            {[
              { label: 'Ready (Green)', count: ragCounts.green, color: '#10B981', bg: '#f0fdf4' },
              { label: 'At Risk (Amber)', count: ragCounts.amber, color: '#F59E0B', bg: '#fffbeb' },
              { label: 'Critical (Red)', count: ragCounts.red, color: '#DC2626', bg: '#fef2f2' },
            ].map(({ label, count, color, bg }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#374151]">{label}</span>
                  <span className="font-semibold text-[#111827]">{count}</span>
                </div>
                <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(count/Math.max(systems.length,1))*100}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 4: Systems needing review ──────────────── */}
      <div className="card">
        <SectionHeader
          title="Systems Needing Review"
          action={() => navigate('/systems')}
          actionLabel="All systems"
        />
        <p className="text-xs text-[#6B7280] mb-4">
          Systems with Amber or Red RAG status that require immediate attention or remediation.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                {['CI ID', 'System', 'Custodian', 'RAG', 'Score', 'Open Gaps', 'Last Evaluated'].map(h => (
                  <th key={h} className="pb-3 pr-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {systems
                .filter(s => ['red', 'amber'].includes(s.rag_status?.toLowerCase()))
                .concat(systems.filter(s => s.rag_status?.toLowerCase() === 'green'))
                .map(s => (
                  <tr
                    key={s.ci_id}
                    className="table-row-hover border-b border-[#F3F4F6]"
                    onClick={() => navigate(`/systems/${s.ci_id}`)}
                  >
                    <td className="py-3 pr-4 font-mono text-xs text-[#6B7280]">{s.ci_id}</td>
                    <td className="py-3 pr-4 font-medium text-[#111827]">{s.system_name}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{s.custodian}</td>
                    <td className="py-3 pr-4"><RAGBadge status={s.rag_status} /></td>
                    <td className="py-3 pr-4"><ScorePill score={s.readiness_score} /></td>
                    <td className="py-3 pr-4 text-center">
                      {s.open_gaps > 0
                        ? <span className="font-semibold text-[#DC2626]">{s.open_gaps}</span>
                        : <span className="text-[#10B981]">0</span>
                      }
                    </td>
                    <td className="py-3 pr-4 text-[#6B7280] text-xs whitespace-nowrap">
                      {s.last_evaluated ? new Date(s.last_evaluated).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
