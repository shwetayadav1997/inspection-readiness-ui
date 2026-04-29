export function RAGBadge({ status }) {
  const s = (status || '').toLowerCase()
  if (s === 'green')  return <span className="badge-green"><span className="dot-ready" /> Ready</span>
  if (s === 'amber')  return <span className="badge-amber"><span className="dot-risk" /> At Risk</span>
  if (s === 'red')    return <span className="badge-red"><span className="dot-critical" /> Critical</span>
  return <span className="badge-gray">Unknown</span>
}

export function ScorePill({ score }) {
  const s = parseFloat(score)
  let cls = 'badge-gray'
  if (s >= 7.5) cls = 'badge-green'
  else if (s >= 5) cls = 'badge-amber'
  else cls = 'badge-red'
  return <span className={cls}>{s?.toFixed(1)}</span>
}

export function SeverityBadge({ severity }) {
  const s = (severity || '').toLowerCase()
  if (s === 'critical') return <span className="badge-red"><span className="dot-critical" /> Critical</span>
  if (s === 'high')     return <span className="badge-red">High</span>
  if (s === 'medium')   return <span className="badge-amber">Medium</span>
  return <span className="badge-gray">Low</span>
}

export function StatusBadge({ status }) {
  const s = (status || '').toLowerCase()
  if (s === 'open')               return <span className="badge-red">Open</span>
  if (s === 'remediated')         return <span className="badge-green">Remediated</span>
  if (s === 'accepted_exception') return <span className="badge-gray">Exception</span>
  if (s === 'in_progress')        return <span className="badge-amber">In Progress</span>
  if (s === 'met')                return <span className="badge-green">Met</span>
  if (s === 'missing')            return <span className="badge-red">Missing</span>
  if (s === 'incomplete')         return <span className="badge-orange">Incomplete</span>
  return <span className="badge-gray">{status}</span>
}

export function Spinner({ size = 5 }) {
  return (
    <div className={`w-${size} h-${size} border-2 border-gray-200 border-t-[#D72027] rounded-full animate-spin`} />
  )
}

export function PageHeader({ title, subtitle, date, actions }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">{title}</h1>
        {subtitle && <p className="text-sm text-[#6B7280] mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {date && (
          <span className="text-xs text-[#6B7280] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-lg">
            Snapshot — {date}
          </span>
        )}
        {actions}
      </div>
    </div>
  )
}

export function SectionHeader({ title, action, actionLabel }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="section-title">{title}</h3>
      {action && (
        <button onClick={action} className="btn-link text-xs">
          {actionLabel} &rsaquo;
        </button>
      )}
    </div>
  )
}
