import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { useCartStore, useSettingsStore } from '../../store/useStore'
import { ShoppingCart, ArrowLeft, Star, Shield, Truck, Package } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '../../lib/utils'
import toast from 'react-hot-toast'
import Spinner from '../../components/ui/Spinner'
import ProductCard from '../../components/shop/ProductCard'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, openCart } = useCartStore()
  const { settings } = useSettingsStore()
  const [qty, setQty] = useState(1)
  const currency = settings.currency || 'KSh'

  const product = useLiveQuery(() => db.products.get(Number(id)), [id])
  const related = useLiveQuery(() => product
    ? db.products.filter(p => p.category === product.category && p.id !== product.id && p.active).limit(4).toArray()
    : [], [product])

  if (!product) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>

  const disc = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  const handleAdd = () => {
    addItem(product, qty)
    toast.success(`Added ${qty}× ${product.name}!`, { icon: '🛍️', style: { borderRadius: '12px', background: '#333', color: '#fff' } })
    openCart()
  }

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
          <div className="card overflow-hidden aspect-square bg-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {disc > 0 && <span className="absolute top-4 left-4 badge bg-red-500 text-white text-sm">-{disc}% OFF</span>}
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <span className="text-brand-600 font-semibold text-sm mb-2">{product.category}</span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex">{[1,2,3,4,5].map(s => (
              <Star key={s} size={16} className={s <= Math.round(product.rating || 4.5) ? 'fill-gold-400 text-gold-400' : 'text-gray-200 fill-gray-200'} />
            ))}</div>
            <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
            <span className="text-green-600 text-sm font-medium">{product.sold} sold</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="font-display text-4xl font-bold text-gray-900">{formatCurrency(product.price, currency)}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-lg mb-1">{formatCurrency(product.originalPrice, currency)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          {/* Stock */}
          <div className={`flex items-center gap-2 text-sm mb-6 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </div>

          {/* Qty + Add */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gray-100 text-lg font-medium transition-colors">−</button>
                <span className="px-5 py-3 font-semibold border-x border-gray-200">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-3 hover:bg-gray-100 text-lg font-medium transition-colors">+</button>
              </div>
              <button onClick={handleAdd} className="btn-primary flex-1 justify-center py-3">
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          )}

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            {[
              { icon: Shield, label: 'Secure Payment',  col: 'text-green-600' },
              { icon: Truck,  label: 'Fast Delivery',   col: 'text-blue-600' },
              { icon: Package,label: 'Easy Returns',    col: 'text-purple-600' },
            ].map(({ icon: Icon, label, col }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <Icon size={22} className={col} />
                <span className="text-xs text-gray-500 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {(related || []).length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
