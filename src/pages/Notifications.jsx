import { useEffect, useState } from 'react'
import { getNotifications, markNotificationRead } from '../api'
import { Spinner, PageHeader } from '../components/ui'
import { Bell, Mail, CheckCheck, Inbox } from 'lucide-react'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [filter, setFilter]               = useState('all')

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const load = () => {
    setLoading(true)
    getNotifications().then(d => setNotifications(Array.isArray(d) ? d : [])).catch(() => setNotifications([])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifications(prev => prev.map(n => (n.id===id||n.notification_id===id) ? {...n,read:true} : n))
    } catch {}
  }
  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read)
    await Promise.all(unread.map(n => markNotificationRead(n.id||n.notification_id).catch(()=>{})))
    setNotifications(prev => prev.map(n => ({...n,read:true})))
  }

  const unread   = notifications.filter(n => !n.read)
  const filtered = notifications.filter(n => {
    if (filter==='unread') return !n.read
    if (filter==='email')  return n.channel==='email'
    if (filter==='in_app') return n.channel==='in_app'
    return true
  })

  return (
    <div className="max-w-[860px]">
      <PageHeader
        title="Notifications"
        subtitle={`${unread.length} unread`}
        date={today}
        actions={unread.length > 0 && (
          <button onClick={handleMarkAllRead} className="btn-secondary">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      />

      <div className="flex gap-1 bg-[#F3F4F6] rounded-lg p-1 border border-[#E5E7EB] mb-5 w-fit">
        {[
          { id:'all',    label:'All' },
          { id:'unread', label:`Unread (${unread.length})` },
          { id:'in_app', label:'In-App' },
          { id:'email',  label:'Email' },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filter===id ? 'bg-[#D72027] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
            }`}>{label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center gap-3 text-[#6B7280] py-12 text-sm"><Spinner size={5} /> Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#9CA3AF] gap-3">
          <Inbox size={36} className="opacity-30" /><p className="text-sm">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => {
            const id = n.id || n.notification_id
            return (
              <div key={id} className={`bg-white rounded-lg border p-4 transition-all ${
                !n.read ? 'border-[#D72027]/20 bg-red-50/30' : 'border-[#E5E7EB]'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    n.channel==='email' ? 'bg-blue-50' : 'bg-purple-50'
                  }`}>
                    {n.channel==='email'
                      ? <Mail size={14} className="text-blue-500" />
                      : <Bell size={14} className="text-purple-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#D72027] flex-shrink-0" />}
                          <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide">
                            {n.channel==='email' ? 'Email' : 'In-App'}
                          </span>
                          {n.ci_id && <span className="font-mono text-xs text-[#9CA3AF]">{n.ci_id}</span>}
                        </div>
                        <p className="text-sm text-[#374151]">{n.message}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[#9CA3AF]">
                          {n.sent_at && <span>{new Date(n.sent_at).toLocaleString()}</span>}
                          {n.delivery_status && (
                            <span className={n.delivery_status==='delivered' ? 'text-emerald-500' : ''}>
                              {n.delivery_status}
                            </span>
                          )}
                        </div>
                      </div>
                      {!n.read && (
                        <button onClick={() => handleMarkRead(id)} className="btn-ghost text-xs flex-shrink-0">
                          <CheckCheck size={12} /> Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

