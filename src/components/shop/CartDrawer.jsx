import { useNavigate } from 'react-router-dom'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, useSettingsStore } from '../../store/useStore'
import { formatCurrency } from '../../lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCartStore()
  const { settings } = useSettingsStore()
  const navigate = useNavigate()
  const currency = settings.currency || 'KSh'
  const shipping = total >= (settings.freeShippingThreshold || 5000) ? 0 : (settings.shippingFee || 250)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={closeCart} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-brand-600" size={22} />
                <span className="font-display text-lg font-bold">Your Cart</span>
                {count > 0 && <span className="badge bg-brand-100 text-brand-700">{count} items</span>}
              </div>
              <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <ShoppingBag size={48} className="text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
                  <button onClick={() => { closeCart(); navigate('/shop') }} className="btn-primary mt-6 text-sm">
                    Continue Shopping
                  </button>
                </div>
              ) : items.map(item => (
                <motion.div key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-brand-600 font-bold mt-1">{formatCurrency(item.price, currency)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>{formatCurrency(total, currency)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatCurrency(shipping, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span><span className="text-brand-600">{formatCurrency(total + shipping, currency)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400 text-center">
                    Add {formatCurrency((settings.freeShippingThreshold || 5000) - total, currency)} more for free shipping
                  </p>
                )}
                <button onClick={() => { closeCart(); navigate('/checkout') }}
                  className="btn-primary w-full justify-center py-3">
                  Checkout
                </button>
                <button onClick={() => { closeCart(); navigate('/shop') }}
                  className="btn-ghost w-full justify-center text-sm">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
