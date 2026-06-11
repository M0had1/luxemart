import { useState, useMemo } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from '../../lib/db'
import { useUIStore } from '../../store/useStore'
import ProductCard from '../../components/shop/ProductCard'
import Spinner from '../../components/ui/Spinner'

export default function ShopPage() {
  const { searchQuery, selectedCategory, sortBy, setCategory, setSort } = useUIStore()
  const [showFilters, setShowFilters] = useState(false)

  const products  = useLiveQuery(() => db.products.filter(p => p.active).toArray(), [])
  const categories = useLiveQuery(() => db.categories.filter(c => c.active).toArray(), [])

  const filtered = useMemo(() => {
    if (!products) return []
    let list = [...products]
    if (selectedCategory !== 'All') list = list.filter(p => p.category === selectedCategory)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
    }
    switch (sortBy) {
      case 'price-asc':  return list.sort((a, b) => a.price - b.price)
      case 'price-desc': return list.sort((a, b) => b.price - a.price)
      case 'rating':     return list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'newest':     return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      default:           return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
  }, [products, selectedCategory, searchQuery, sortBy])

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Shop</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary text-sm gap-2 md:hidden">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <select value={sortBy} onChange={e => setSort(e.target.value)} className="input w-auto text-sm py-2">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-56 shrink-0`}>
          <div className="card p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-1">
              {['All', ...(categories || []).map(c => c.name)].map(cat => (
                <li key={cat}>
                  <button onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${selectedCategory === cat ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {!products ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
              <button onClick={() => { setCategory('All'); }} className="btn-primary mt-6 text-sm">Clear Filters</button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence>
                {filtered.map(p => (
                  <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
