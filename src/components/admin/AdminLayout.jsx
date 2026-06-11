import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Menu, X, ChevronRight, Bell, Store } from 'lucide-react'
import { useAdminStore, useSettingsStore } from '../../store/useStore'
import { ADMIN_PATH } from '../../lib/auth'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const NAV = [
  { to: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: 'products',   label: 'Products',   icon: Package },
  { to: 'orders',     label: 'Orders',     icon: ShoppingBag },
  { to: 'staff',      label: 'Staff',      icon: Users },
  { to: 'settings',   label: 'Settings',   icon: Settings },
]

export default function AdminLayout() {
  const { logout, admin }    = useAdminStore()
  const { settings }         = useSettingsStore()
  const navigate             = useNavigate()
  const [sideOpen, setSide]  = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/x8k2-management', { replace: true })
    toast.success('Logged out successfully')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{settings.logo || '💎'}</span>
          <div>
            <p className="font-display font-bold text-white text-base">{settings.appName || 'LuxeMart'}</p>
            <p className="text-[11px] text-white/40 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={`${ADMIN_PATH}/${to}`} onClick={() => setSide(false)}
            className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
            <ChevronRight size={14} className="ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {(admin?.email || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{admin?.email}</p>
            <p className="text-white/40 text-xs">Super Admin</p>
          </div>
        </div>
        <button onClick={handleLogout} className="admin-sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 mt-1">
          <LogOut size={18} /><span>Logout</span>
        </button>
        <a href="/" target="_blank" className="admin-sidebar-link w-full mt-1 text-white/50 hover:text-white">
          <Store size={18} /><span>View Store</span>
        </a>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sideOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSide(false)} />
            <motion.aside initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-gray-900 md:hidden flex flex-col">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setSide(!sideOpen)}>
            {sideOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden md:block">
            <h1 className="font-semibold text-gray-900">Welcome back, Admin 👋</h1>
            <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
