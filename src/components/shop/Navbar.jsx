import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X, Heart } from 'lucide-react'
import { useCartStore, useUIStore, useSettingsStore } from '../../store/useStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { count, toggleCart } = useCartStore()
  const { searchQuery, setSearch } = useUIStore()
  const { settings } = useSettingsStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()

  const nav = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">{settings.logo || '💎'}</span>
            <span className="font-display text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
              {settings.appName || 'LuxeMart'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(n => (
              <Link key={n.to} to={n.to}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
              <Search size={20} />
            </button>

            {/* Cart */}
            <button onClick={toggleCart} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
              <ShoppingBag size={20} />
              {count > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </motion.span>
              )}
            </button>

            {/* Mobile menu */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-3">
              <input className="input" placeholder="Search products…"
                value={searchQuery} autoFocus
                onChange={e => { setSearch(e.target.value); navigate('/shop') }}
                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-gray-100 bg-white shadow-lg">
            {nav.map(n => (
              <Link key={n.to} to={n.to} onClick={() => setMenuOpen(false)}
                className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                {n.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
