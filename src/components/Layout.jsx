import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Server, AlertTriangle, Bell,
  PlayCircle, Search, ChevronRight, LogOut, User
} from 'lucide-react'
import { getNotifications } from '../api'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/systems',   icon: Server,          label: 'Systems' },
  { to: '/gaps',      icon: AlertTriangle,   label: 'Gap Storyboards' },
  { to: '/notifications', icon: Bell,        label: 'Notifications' },
  { to: '/runs',      icon: PlayCircle,      label: 'Runs' },
]

const BREADCRUMB_MAP = {
  '/dashboard':     'Inspection Readiness Overview',
  '/systems':       'Systems',
  '/gaps':          'Gap Storyboards',
  '/notifications': 'Notifications',
  '/runs':          'Runs',
}

export default function Layout() {
  const [unread, setUnread] = useState(0)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    getNotifications()
      .then(data => setUnread((data || []).filter(n => !n.read).length))
      .catch(() => {})
  }, [])

  const breadcrumb = BREADCRUMB_MAP[location.pathname] ||
    (location.pathname.startsWith('/systems/') ? 'System Detail' : '')

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className="flex flex-col w-60 flex-shrink-0 bg-white border-r border-[#E5E7EB]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-[#E5E7EB]">
          <div className="w-8 h-8 bg-[#D72027] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold leading-none">IRA</span>
          </div>
          <span className="text-sm font-semibold text-[#111827] leading-tight">
            Inspection Readiness Agent
          </span>
        </div>

        {/* User badge */}
        <div className="px-5 pt-5 pb-3">
          <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Quality Admin</div>
          <div className="text-[11px] text-[#9CA3AF] mt-0.5">Org-wide visibility</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {to === '/notifications' && unread > 0 && (
                <span className="text-[10px] bg-[#D72027] text-white rounded-full px-1.5 py-0.5 font-bold">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 pt-3 border-t border-[#E5E7EB]">
          <button onClick={() => navigate('/login')} className="sidebar-link w-full">
            <LogOut size={16} className="text-gray-400" />
            <span className="text-gray-500">Log out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              className="w-full bg-[#F3F3F5] border border-[#E5E7EB] text-sm rounded-lg pl-9 pr-4 py-2 text-gray-700 placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#D72027]/20"
              placeholder="Search trials, systems, owners…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Right: bell + avatar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/notifications')}
              className="relative w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Bell size={18} className="text-[#374151]" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#D72027] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#E5E7EB]">
              <div className="w-8 h-8 bg-[#D72027] rounded-full flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#111827]">Quality Admin</div>
                <div className="text-[10px] text-[#9CA3AF]">Org-wide visibility</div>
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="px-6 py-2.5 flex items-center gap-1.5 text-xs text-[#6B7280] bg-white border-b border-[#E5E7EB]">
          <span>Home</span>
          <ChevronRight size={12} />
          <span className="text-[#111827]">{breadcrumb}</span>
        </div>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 px-6 py-3 bg-white border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="text-xs text-[#9CA3AF]">Eli Lilly &amp; Company</span>
          <span className="text-xs text-[#9CA3AF]">v1.0.0 — Quality Admin</span>
        </footer>
      </div>
    </div>
  )
}
