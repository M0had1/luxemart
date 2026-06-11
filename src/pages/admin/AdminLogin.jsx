import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { adminLogin, isRateLimited } from '../../lib/auth'
import { useAdminStore } from '../../store/useStore'
import { ADMIN_PATH } from '../../lib/auth'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { login }               = useAdminStore()
  const navigate                = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const limit = isRateLimited()
    if (limit.locked) { setError(`Too many attempts. Wait ${limit.remaining}s.`); return }
    setLoading(true)
    try {
      const admin = await adminLogin(email, password)
      login(admin)
      navigate(ADMIN_PATH + '/dashboard', { replace: true })
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-brand-950 to-purple-950 flex items-center justify-center p-4">
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-brand-600/20 border border-brand-500/30 rounded-2xl mx-auto mb-6">
            <Shield className="text-brand-400" size={28} />
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-gray-400 text-sm mt-1">Authorized personnel only</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-5">
              {error}
            </motion.div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="admin@example.com" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all mt-2 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating…</>
              ) : (
                <><Lock size={16} /> Sign In</>
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-6">Protected by rate limiting & encryption</p>
        </div>
      </motion.div>
    </div>
  )
}
