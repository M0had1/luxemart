import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore, useSettingsStore } from '../../store/useStore'
import { db } from '../../lib/db'
import { formatCurrency, generateOrderId } from '../../lib/utils'
import { CheckCircle, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const { settings } = useSettingsStore()
  const navigate = useNavigate()
  const currency = settings.currency || 'KSh'
  const taxRate  = (settings.taxRate || 16) / 100
  const shipping = total >= (settings.freeShippingThreshold || 5000) ? 0 : (settings.shippingFee || 250)
  const tax      = Math.round(total * taxRate)
  const grandTotal = total + tax + shipping

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', payment: 'mpesa' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.address) return toast.error('Please fill all required fields')
    setSubmitting(true)
    try {
      await db.orders.add({
        orderId: generateOrderId(), customerName: form.name, customerEmail: form.email,
        customerPhone: form.phone, customerAddress: form.address, customerCity: form.city,
        items: items.map(i => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty })),
        subtotal: total, tax, shipping, total: grandTotal,
        status: 'pending', paymentMethod: form.payment, createdAt: Date.now()
      })
      // Update stock & sold counts
      for (const item of items) {
        const p = await db.products.get(item.id)
        if (p) await db.products.update(item.id, { stock: Math.max(0, (p.stock || 0) - item.qty), sold: (p.sold || 0) + item.qty })
      }
      const id = generateOrderId()
      setOrderId(id)
      clearCart()
      setDone(true)
    } catch (e) { toast.error('Order failed. Try again.') }
    finally { setSubmitting(false) }
  }

  if (done) return (
    <div className="page-enter min-h-[60vh] flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="card p-10 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h2>
        <p className="text-gray-500 mb-6">Thank you, <b>{form.name}</b>! Your order has been received and is being processed.</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
          <p className="text-gray-500">Total Charged</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">{formatCurrency(grandTotal, currency)}</p>
        </div>
        <button onClick={() => navigate('/')} className="btn-primary w-full justify-center">Back to Home</button>
      </motion.div>
    </div>
  )

  if (!items.length) return (
    <div className="page-enter text-center py-32">
      <p className="text-5xl mb-4">🛒</p>
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <button onClick={() => navigate('/shop')} className="btn-primary mt-6">Shop Now</button>
    </div>
  )

  const Label = ({ children }) => <label className="text-sm font-medium text-gray-700 mb-1 block">{children}</label>

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Lock size={20} className="text-brand-600" />
        <h1 className="font-display text-3xl font-bold">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={submit} className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Full Name *</Label><input className="input" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
              <div><Label>Email *</Label><input type="email" className="input" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
              <div><Label>Phone</Label><input type="tel" className="input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
              <div><Label>City</Label><input className="input" value={form.city} onChange={e => set('city', e.target.value)} /></div>
              <div className="sm:col-span-2"><Label>Delivery Address *</Label><textarea className="input" rows={3} value={form.address} onChange={e => set('address', e.target.value)} required /></div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
            {[['mpesa', '📱 M-Pesa'], ['card', '💳 Credit / Debit Card'], ['cod', '💵 Cash on Delivery']].map(([val, label]) => (
              <label key={val} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer mb-2 transition-all
                ${form.payment === val ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300'}`}>
                <input type="radio" name="payment" value={val} checked={form.payment === val} onChange={() => set('payment', val)} className="accent-brand-600" />
                <span className="font-medium text-sm">{label}</span>
              </label>
            ))}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-4">
            {submitting ? 'Placing Order…' : `Place Order · ${formatCurrency(grandTotal, currency)}`}
          </button>
        </form>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map(i => (
              <div key={i.id} className="flex items-center gap-3">
                <img src={i.image} alt={i.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{i.name}</p>
                  <p className="text-xs text-gray-400">×{i.qty}</p>
                </div>
                <span className="text-sm font-semibold text-gray-800">{formatCurrency(i.price * i.qty, currency)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(total, currency)}</span></div>
            <div className="flex justify-between"><span>Tax ({settings.taxRate || 16}%)</span><span>{formatCurrency(tax, currency)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatCurrency(shipping, currency)}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
              <span>Total</span><span className="text-brand-600">{formatCurrency(grandTotal, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
