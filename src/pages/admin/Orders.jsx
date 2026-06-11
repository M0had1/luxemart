import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { useSettingsStore } from '../../store/useStore'
import { formatCurrency, statusColor, formatDate, STATUSES } from '../../lib/utils'
import { Search, Eye } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

export default function Orders() {
  const { settings } = useSettingsStore()
  const currency = settings.currency || 'KSh'
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [viewing, setViewing]   = useState(null)

  const orders = useLiveQuery(() => db.orders.orderBy('createdAt').reverse().toArray(), [])

  const filtered = (orders || []).filter(o => {
    const matchStatus = filter === 'all' || o.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || (o.customerName || '').toLowerCase().includes(q) || (o.customerEmail || '').toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const updateStatus = async (id, status) => {
    await db.orders.update(id, { status })
    toast.success(`Order marked as ${status}`)
    if (viewing) setViewing(v => ({ ...v, status }))
  }

  const revenue = (orders || []).filter(o => o.status === 'delivered').reduce((s, o) => s + (o.total || 0), 0)

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{(orders || []).length} total · Revenue: {formatCurrency(revenue, currency)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer…" />
        </div>
        <select className="input w-auto text-sm" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
              {['Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map((h, i) => (
                <th key={i} className="px-5 py-3 font-semibold">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{o.customerName}</p>
                    <p className="text-xs text-gray-400">{o.customerEmail}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{o.items?.length || 0} item{(o.items?.length||0)!==1?'s':''}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{formatCurrency(o.total || 0, currency)}</td>
                  <td className="px-5 py-3.5 text-gray-500">{o.paymentMethod}</td>
                  <td className="px-5 py-3.5">
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      className={`badge cursor-pointer border-0 outline-none ${statusColor(o.status)} text-xs font-semibold py-1 px-2`}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(o.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setViewing(o)} className="p-1.5 hover:bg-brand-50 text-brand-600 rounded-lg transition-colors"><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Order Details" size="md">
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400">Customer</p><p className="font-semibold">{viewing.customerName}</p></div>
              <div><p className="text-gray-400">Email</p><p className="font-semibold">{viewing.customerEmail}</p></div>
              <div><p className="text-gray-400">Phone</p><p className="font-semibold">{viewing.customerPhone || '—'}</p></div>
              <div><p className="text-gray-400">Payment</p><p className="font-semibold">{viewing.paymentMethod}</p></div>
              <div className="col-span-2"><p className="text-gray-400">Address</p><p className="font-semibold">{viewing.customerAddress || '—'}</p></div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Items</p>
              {(viewing.items || []).map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 text-sm border-b border-gray-50">
                  <span className="text-gray-700">{item.name} ×{item.qty}</span>
                  <span className="font-semibold">{formatCurrency(item.price * item.qty, currency)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(viewing.subtotal || 0, currency)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax</span><span>{formatCurrency(viewing.tax || 0, currency)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{formatCurrency(viewing.shipping || 0, currency)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-base">
                <span>Total</span><span className="text-brand-600">{formatCurrency(viewing.total || 0, currency)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm font-medium text-gray-600">Update Status:</span>
              <select value={viewing.status} onChange={e => updateStatus(viewing.id, e.target.value)} className="input w-auto text-sm py-1.5">
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
