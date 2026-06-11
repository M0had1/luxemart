import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { db } from '../../lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSettingsStore } from '../../store/useStore'
import ProductCard from '../../components/shop/ProductCard'
import { formatCurrency } from '../../lib/utils'

const perks = [
  { icon: Truck, title: 'Free Shipping', desc: 'Free delivery on orders over KSh 5,000', color: 'bg-blue-50 text-blue-600' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure transactions guaranteed', color: 'bg-green-50 text-green-600' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free return policy', color: 'bg-purple-50 text-purple-600' },
  { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock customer service', color: 'bg-orange-50 text-orange-600' },
]

export default function HomePage() {
  const { settings } = useSettingsStore()
  const featured = useLiveQuery(() => db.products.where('featured').equals(1).filter(p => p.active).toArray(), [])
  const allProducts = useLiveQuery(() => db.products.filter(p => p.active).limit(8).toArray(), [])

  const stagger = { visible: { transition: { staggerChildren: 0.08 } } }
  const item    = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-purple-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-brand-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="max-w-2xl">
            <span className="inline-block badge bg-white/10 text-white border border-white/20 mb-4 py-1 px-3">
              ✨ {settings.appTagline || 'Premium Shopping, Redefined'}
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Discover<br />
              <span className="bg-gradient-to-r from-brand-300 to-pink-300 bg-clip-text text-transparent">
                Luxury Products
              </span>
            </h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Shop the finest selection of premium products, hand-picked for quality, style, and value.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/shop" className="btn-primary bg-white text-brand-700 hover:bg-gray-100 py-3 px-8">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary bg-transparent border-white/30 text-white hover:bg-white/10 py-3 px-8">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="card p-5 flex items-center gap-3">
              <div className={`w-11 h-11 ${p.color} rounded-xl flex items-center justify-center shrink-0`}>
                <p.icon size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{p.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-brand-600 font-semibold text-sm">Handpicked for you</span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-1">Featured Products</h2>
          </div>
          <Link to="/shop" className="btn-ghost text-brand-600 text-sm font-semibold">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <motion.div variants={stagger} initial="hidden" animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {(featured || []).map(p => (
            <motion.div key={p.id} variants={item}><ProductCard product={p} /></motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-purple-600 p-10 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl font-bold mb-3">New Arrivals Every Week</h2>
            <p className="text-white/80 max-w-md">Be the first to discover our newest collections. Shop fresh arrivals and exclusive deals.</p>
          </div>
          <Link to="/shop" className="btn-primary bg-white text-brand-700 hover:bg-gray-100 py-3 px-8 shrink-0">
            Explore New Arrivals <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* All Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-brand-600 font-semibold text-sm">Browse everything</span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-1">All Products</h2>
          </div>
          <Link to="/shop" className="btn-ghost text-brand-600 text-sm font-semibold">See more <ArrowRight size={16} /></Link>
        </div>
        <motion.div variants={stagger} initial="hidden" animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {(allProducts || []).map(p => (
            <motion.div key={p.id} variants={item}><ProductCard product={p} /></motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
