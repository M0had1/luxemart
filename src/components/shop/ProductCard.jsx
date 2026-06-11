import { useState } from 'react'
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore, useSettingsStore } from '../../store/useStore'
import { formatCurrency } from '../../lib/utils'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addItem } = useCartStore()
  const { settings } = useSettingsStore()
  const [liked, setLiked] = useState(false)
  const [adding, setAdding] = useState(false)
  const navigate = useNavigate()
  const currency = settings.currency || 'KSh'
  const disc = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const handleAdd = async (e) => {
    e.stopPropagation()
    setAdding(true)
    addItem(product)
    toast.success(`${product.name} added to cart!`, {
      icon: '🛍️', style: { borderRadius: '12px', background: '#333', color: '#fff' }
    })
    setTimeout(() => setAdding(false), 600)
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
      className="card group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        <img src={product.image} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {disc > 0 && <span className="badge bg-red-500 text-white">-{disc}%</span>}
          {product.featured && <span className="badge bg-brand-600 text-white">Featured</span>}
          {product.stock < 5 && product.stock > 0 && (
            <span className="badge bg-orange-500 text-white">Low Stock</span>
          )}
          {product.stock === 0 && <span className="badge bg-gray-500 text-white">Sold Out</span>}
        </div>

        {/* Like */}
        <button onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
          <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
            <Eye size={12} /> Quick View
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-brand-600 font-medium mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 leading-snug">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12} className={s <= Math.round(product.rating || 4.5)
                ? 'fill-gold-400 text-gold-400' : 'text-gray-200 fill-gray-200'} />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviews || 0})</span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">{formatCurrency(product.price, currency)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-2">
                {formatCurrency(product.originalPrice, currency)}
              </span>
            )}
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleAdd}
            disabled={product.stock === 0 || adding}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm transition-all
              ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : adding ? 'bg-green-500 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
            {adding ? '✓' : <ShoppingCart size={16} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
