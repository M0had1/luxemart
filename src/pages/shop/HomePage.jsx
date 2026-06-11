import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones,
  Star, Package, Users, Award, ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { useSettingsStore } from '../../store/useStore'
import ProductCard from '../../components/shop/ProductCard'

// ─── Animated number counter ─────────────────────────────────
function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const frames = 80
    const step = to / frames
    let cur = 0
    const id = setInterval(() => {
      cur += step
      if (cur >= to) { setVal(to); clearInterval(id) }
      else setVal(Math.round(cur))
    }, 18)
    return () => clearInterval(id)
  }, [inView, to])
  const display = val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val
  return <span ref={ref}>{display}{suffix}</span>
}

// ─── Infinite marquee ticker ──────────────────────────────────
const STRIP = [
  '✦ Free Shipping on Orders Over KSh 5,000',
  '✦ Secure & Encrypted Payments',
  '✦ Premium Quality Guarantee',
  '✦ 30-Day Hassle-Free Returns',
  '✦ New Arrivals Every Week',
  '✦ 24/7 Customer Support',
]
function Marquee() {
  const doubled = [...STRIP, ...STRIP]
  return (
    <div className="bg-gray-900 text-white/60 py-2.5 overflow-hidden select-none">
      <motion.div className="flex gap-16 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 32, ease: 'linear', repeat: Infinity }}>
        {doubled.map((item, i) => (
          <span key={i} className="text-[10px] font-semibold tracking-[0.2em] uppercase shrink-0">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Category data ────────────────────────────────────────────
const CATS = [
  { name: 'Electronics', count: '120+', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80' },
  { name: 'Fashion',     count: '340+', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80' },
  { name: 'Home & Living', count: '210+', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  { name: 'Beauty',      count: '180+', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80' },
  { name: 'Sports',      count: '95+',  img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80' },
]

// ─── Testimonials ─────────────────────────────────────────────
const REVIEWS = [
  { name: 'Alice Wanjiru', loc: 'Nairobi',  color: 'bg-purple-500', avatar: 'A', rating: 5,
    text: 'The quality is absolutely outstanding. My order arrived faster than expected and the packaging was beautiful. This is now my go-to store.' },
  { name: 'Brian Ochieng', loc: 'Mombasa',  color: 'bg-blue-500',   avatar: 'B', rating: 5,
    text: "LuxeMart has the best premium selection I've found in Kenya. Never been disappointed — products are exactly as shown." },
  { name: 'Carol Mwangi',  loc: 'Kisumu',   color: 'bg-pink-500',   avatar: 'C', rating: 5,
    text: 'Customer service is impeccable. Had a question, resolved in minutes. The entire experience feels genuinely premium.' },
  { name: 'David Kamau',   loc: 'Nakuru',   color: 'bg-emerald-500', avatar: 'D', rating: 5,
    text: "Finally a Kenyan store that feels world-class. Even the packaging tells you they care. I've recommended LuxeMart to everyone." },
]

// ─── Floating badge helper ────────────────────────────────────
function FloatingBadge({ children, delay, yRange, className }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay }}>
      <motion.div animate={{ y: [0, -yRange, 0] }}
        transition={{ duration: 3.5 + delay, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}>
        {children}
      </motion.div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function HomePage() {
  const { settings }  = useSettingsStore()
  const featured      = useLiveQuery(() => db.products.where('featured').equals(1).filter(p => p.active).toArray(), [])
  const allProducts   = useLiveQuery(() => db.products.filter(p => p.active).limit(8).toArray(), [])

  const heroTextVariants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.13 } },
  }
  const lineVariant = {
    hidden: { opacity: 0, y: 44, skewY: 1.5 },
    show:   { opacity: 1, y: 0,  skewY: 0,    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div>
      <Marquee />

      {/* ════════════════════════════════════════════════════
          HERO — full-screen cinematic dark
      ════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden" style={{ background: '#07070e' }}>

        {/* Animated glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute -top-64 -left-64 w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(192,38,211,0.20) 0%, transparent 65%)' }}
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute -bottom-64 right-0 w-[800px] h-[800px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)' }}
            animate={{ scale: [1.15, 1, 1.15] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.018]"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center py-28 lg:min-h-screen">

            {/* ── Text column ── */}
            <motion.div variants={heroTextVariants} initial="hidden" animate="show" className="relative z-10">

              {/* Eyebrow pill */}
              <motion.div variants={fadeUp} className="mb-8">
                <span className="inline-flex items-center gap-2.5 bg-white/[0.055] border border-white/[0.1] rounded-full px-4 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                  <span className="text-brand-300 text-[11px] font-bold tracking-[0.16em] uppercase">
                    {settings.appTagline || 'Premium Shopping, Redefined'}
                  </span>
                </span>
              </motion.div>

              {/* Animated headline */}
              <h1 className="font-display font-bold text-white leading-[1.03] mb-7 overflow-hidden">
                {[
                  { text: 'Discover',     gradient: false },
                  { text: 'The Premium',  gradient: true  },
                  { text: 'Experience.',  gradient: false },
                ].map(({ text, gradient }) => (
                  <motion.span key={text} variants={lineVariant} className="block text-5xl md:text-6xl xl:text-[4.5rem]">
                    {gradient
                      ? <span className="bg-gradient-to-r from-brand-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">{text}</span>
                      : text}
                  </motion.span>
                ))}
              </h1>

              {/* Subtext */}
              <motion.p variants={fadeUp}
                className="text-white/42 text-base md:text-[1.05rem] leading-relaxed max-w-sm mb-10">
                Handpicked electronics, fashion, beauty and lifestyle products — curated for quality, delivered with care.
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-14">
                <Link to="/shop"
                  className="group relative inline-flex items-center gap-2.5 bg-brand-600 text-white font-semibold px-8 py-4 rounded-2xl overflow-hidden transition-shadow duration-300"
                  style={{ boxShadow: '0 0 45px rgba(192,38,211,0.38)' }}>
                  <motion.span className="absolute inset-0 bg-gradient-to-r from-brand-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-2.5">
                    Shop Collection
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
                      <ArrowRight size={17} />
                    </motion.span>
                  </span>
                </Link>
                <Link to="/about"
                  className="inline-flex items-center gap-2 bg-white/[0.055] hover:bg-white/[0.1] border border-white/[0.12] text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300">
                  Our Story
                </Link>
              </motion.div>

              {/* Social proof row */}
              <motion.div variants={fadeUp} className="flex items-center gap-5 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    {['#8b5cf6','#ec4899','#3b82f6','#10b981'].map((c, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-[2.5px] flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ borderColor: '#07070e', backgroundColor: c }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-yellow-400 text-yellow-400" />)}</div>
                    <p className="text-white/32 text-[11px] mt-0.5 leading-tight">10,000+ happy customers</p>
                  </div>
                </div>
                <div className="h-9 w-px bg-white/[0.08] hidden sm:block" />
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-2xl font-bold text-white">4.9<span className="text-brand-400 text-lg">/5</span></p>
                    <p className="text-white/32 text-[11px] leading-tight">Avg rating</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">98<span className="text-brand-400 text-lg">%</span></p>
                    <p className="text-white/32 text-[11px] leading-tight">Satisfied</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* ── Product visual column ── */}
            <div className="relative h-[520px] lg:h-[580px] hidden lg:block">

              {/* Card 1 — main, top right */}
              <motion.div className="absolute top-10 right-0 w-52 h-72"
                initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                <motion.div className="w-full h-full rounded-3xl overflow-hidden border border-white/[0.09] relative"
                  style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.65)', rotate: 3 }}
                  animate={{ y: [0, -13, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm leading-tight">Premium Headphones</p>
                    <p className="text-brand-300 text-xs font-medium mt-0.5">KSh 8,500</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Card 2 — upper left */}
              <motion.div className="absolute top-0 left-6 w-44 h-60"
                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <motion.div className="w-full h-full rounded-3xl overflow-hidden border border-white/[0.09] relative"
                  style={{ boxShadow: '0 25px 65px rgba(0,0,0,0.60)', rotate: -4 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-semibold text-xs">Smart Watch Pro</p>
                    <p className="text-brand-300 text-[11px] mt-0.5">KSh 15,000</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Card 3 — bottom center */}
              <motion.div className="absolute bottom-4 left-20 w-48 h-64"
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <motion.div className="w-full h-full rounded-3xl overflow-hidden border border-white/[0.09] relative"
                  style={{ boxShadow: '0 30px 75px rgba(0,0,0,0.60)', rotate: 5 }}
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
                  <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80" alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm">Vitamin C Serum</p>
                    <p className="text-brand-300 text-xs mt-0.5">KSh 2,800</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* ─ Floating rating badge ─ */}
              <FloatingBadge delay={0.85} yRange={7} className="absolute top-40 right-[13.5rem] z-20">
                <div className="bg-white rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5" style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
                  <div className="w-8 h-8 rounded-xl bg-yellow-50 flex items-center justify-center text-lg">⭐</div>
                  <div>
                    <p className="text-gray-900 text-[11px] font-bold leading-tight">4.9 Rating</p>
                    <p className="text-gray-400 text-[10px]">2,400+ reviews</p>
                  </div>
                </div>
              </FloatingBadge>

              {/* ─ Free delivery badge ─ */}
              <FloatingBadge delay={1.05} yRange={6} className="absolute top-4 right-[13rem] z-20">
                <div className="bg-gray-900/85 backdrop-blur-md border border-white/[0.1] rounded-2xl px-3.5 py-2 flex items-center gap-2" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
                  <Truck size={13} className="text-brand-400 shrink-0" />
                  <span className="text-white text-[11px] font-semibold">Free Delivery</span>
                </div>
              </FloatingBadge>

              {/* ─ Sale badge ─ */}
              <FloatingBadge delay={1.25} yRange={8} className="absolute bottom-20 right-1 z-20">
                <div className="rounded-2xl px-4 py-2.5" style={{ background: 'linear-gradient(135deg, #c026d3, #ec4899)', boxShadow: '0 8px 32px rgba(192,38,211,0.45)' }}>
                  <p className="text-white text-xs font-bold">Up to 40% Off</p>
                  <p className="text-white/65 text-[10px] mt-0.5">Limited time</p>
                </div>
              </FloatingBadge>

              {/* ─ Order delivered badge ─ */}
              <FloatingBadge delay={1.45} yRange={6} className="absolute bottom-52 left-0 z-20">
                <div className="bg-white rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5" style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.22)' }}>
                  <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-base">✓</span>
                  </div>
                  <div>
                    <p className="text-gray-900 text-[11px] font-bold leading-tight">Just Delivered</p>
                    <p className="text-gray-400 text-[10px]">Order #8,421 🎉</p>
                  </div>
                </div>
              </FloatingBadge>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ opacity: [0.25, 0.6, 0.25] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <span className="text-white/30 text-[8px] font-bold tracking-[0.35em] uppercase">Scroll</span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
            <motion.div className="w-1 h-2 bg-brand-500 rounded-full"
              animate={{ y: [0, 13, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="text-brand-600 font-bold text-[11px] uppercase tracking-[0.18em] mb-2">Explore</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">Shop by Category</h2>
            </motion.div>
            <Link to="/shop" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              All categories <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATS.map((cat, i) => (
              <motion.div key={cat.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                whileHover={{ y: -6, transition: { duration: 0.28 } }}>
                <Link to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group relative block rounded-2xl overflow-hidden h-64 cursor-pointer">
                  <img src={cat.img} alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.08] transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-sm">{cat.name}</p>
                    <p className="text-white/55 text-xs mt-0.5">{cat.count} items</p>
                  </div>
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight size={11} className="text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════════════════ */}
      <section className="py-20" style={{ background: '#f8f7fb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="text-brand-600 font-bold text-[11px] uppercase tracking-[0.18em] mb-2">Handpicked</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
            </motion.div>
            <Link to="/shop" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all <ChevronRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {(featured || []).map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #130520 0%, #1e0b38 45%, #130520 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <motion.div className="absolute top-0 left-1/4 w-96 h-40 opacity-30"
            style={{ background: 'radial-gradient(ellipse, rgba(192,38,211,0.4), transparent 70%)' }}
            animate={{ scaleX: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { icon: Users,   label: 'Happy Customers',    to: 10000, suffix: '+' },
              { icon: Package, label: 'Products Delivered', to: 50000, suffix: '+'  },
              { icon: Star,    label: 'Average Rating',     fixed: '4.9', suffix: '/5' },
              { icon: Award,   label: 'Brand Partners',     to: 200,  suffix: '+' },
            ].map(({ icon: Icon, label, to, suffix, fixed }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center">
                <div className="w-11 h-11 rounded-xl bg-brand-600/20 border border-brand-500/25 flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <p className="font-display text-4xl font-bold text-white mb-1.5">
                  {fixed
                    ? <>4.9<span className="text-brand-400">/5</span></>
                    : <><Counter to={to} /><span className="text-brand-400">{suffix}</span></>}
                </p>
                <p className="text-white/38 text-sm font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PERKS ROW
      ════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Truck,       title: 'Free Shipping',   desc: 'On orders over KSh 5,000', cls: 'bg-blue-50   text-blue-600' },
              { icon: ShieldCheck, title: 'Secure Payment',  desc: '100% safe & encrypted',   cls: 'bg-green-50  text-green-600' },
              { icon: RefreshCw,   title: 'Easy Returns',    desc: '30-day return policy',     cls: 'bg-purple-50 text-purple-600' },
              { icon: Headphones,  title: '24/7 Support',    desc: 'Always here to help',      cls: 'bg-orange-50 text-orange-600' },
            ].map(({ icon: Icon, title, desc, cls }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.09 }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 bg-white">
                <div className={`w-12 h-12 rounded-xl ${cls} flex items-center justify-center shrink-0`}>
                  <Icon size={21} />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════ */}
      <section className="py-24 overflow-hidden" style={{ background: '#f8f7fb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-brand-600 font-bold text-[11px] uppercase tracking-[0.18em] mb-2">What They Say</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">Loved by Thousands</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r, i) => (
              <motion.div key={r.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.27 } }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${r.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm leading-tight">{r.name}</p>
                    <p className="text-gray-400 text-xs">{r.loc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #701a75 100%)' }} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #c026d3, transparent 65%)' }}
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 5.5, repeat: Infinity }} />
          <motion.div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-18"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 65%)' }}
            animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 7, repeat: Infinity }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-white/10 border border-white/20 text-white/65 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-7">
              New Collection
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-[1.07]">
              New Arrivals,<br />
              <span className="bg-gradient-to-r from-brand-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                Every Single Week.
              </span>
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Be the first to discover our freshest collections — exclusive deals, trending styles, and premium quality.
            </p>
            <Link to="/shop"
              className="inline-flex items-center gap-2.5 bg-white text-brand-700 font-bold px-10 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300"
              style={{ boxShadow: '0 0 50px rgba(255,255,255,0.15)' }}>
              Explore New Arrivals <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ALL PRODUCTS
      ════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="text-brand-600 font-bold text-[11px] uppercase tracking-[0.18em] mb-2">Browse</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">All Products</h2>
            </motion.div>
            <Link to="/shop" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
              See more <ChevronRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {(allProducts || []).map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
