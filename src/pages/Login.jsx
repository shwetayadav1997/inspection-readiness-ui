import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/dashboard') }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#111827] p-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D72027] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IRA</span>
          </div>
          <span className="text-white font-semibold text-lg">Inspection Readiness Agent</span>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              GxP Inspection<br />
              <span className="text-[#C77F3E]">Readiness</span><br />
              at Scale
            </h2>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed max-w-sm">
              AI-powered readiness scoring, automated gap detection, and cross-source validation for regulatory inspections at Eli Lilly.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: '5', label: 'Systems Monitored' },
              { val: '82%', label: 'Coverage Rate' },
              { val: '6', label: 'Active Gaps' },
              { val: 'Daily', label: 'Automated Runs' },
            ].map(({ val, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{val}</div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield size={12} />
          <span>Protected by Lilly SSO · Azure Entra ID</span>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="w-9 h-9 bg-[#D72027] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">IRA</span>
            </div>
            <span className="font-bold text-[#111827] text-lg">Inspection Readiness Agent</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Sign in</h1>
            <p className="text-sm text-[#6B7280] mt-1">Use your Lilly SSO credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">Work Email</label>
              <input
                type="email"
                className="input"
                placeholder="name@lilly.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 font-semibold">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                : 'Sign in with Lilly SSO'
              }
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">or</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full justify-center">
            Continue as Demo User
          </button>

          <p className="text-center text-xs text-[#9CA3AF]">
            By signing in you agree to Lilly's Information Security Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
