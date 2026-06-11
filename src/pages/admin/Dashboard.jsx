import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { useSettingsStore } from '../../store/useStore'
import { formatCurrency, statusColor, timeAgo } from '../../lib/utils'
import { TrendingUp, ShoppingBag, Package, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { settings } = useSettingsStore()
  const currency = settings.currency || 'KSh'

  const orders   = useLiveQuery(() => db.orders.toArray(), [])
  const products  = useLiveQuery(() => db.products.toArray(), [])
  const staff     = useLiveQuery(() => db.staff.toArray(), [])

  if (!orders || !products) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>

  const delivered  = orders.filter(o => o.status === 'delivered')
  const revenue    = delivered.reduce((s, o) => s + (o.total || 0), 0)
  const cost       = delivered.reduce((s, o) => s + (o.subtotal || 0) * 0.4, 0)
  const profit     = revenue - cost
  const pending    = orders.filter(o => o.status === 'pending').length
  const totalSold  = products.reduce((s, p) => s + (p.sold || 0), 0)
  const lowStock   = products.filter(p => p.stock < 5).length

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(revenue, currency), icon: TrendingUp, color: 'bg-green-50 text-green-600', change: '+12.5%', up: true },
    { label: 'Net Profit',    value: formatCurrency(profit, currency),  icon: ArrowUpRight, color: 'bg-brand-50 text-brand-600', change: '+8.2%', up: true },
    { label: 'Total Orders',  value: orders.length, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', change: `${pending} pending`, up: null },
    { label: 'Products Sold', value: totalSold,     icon: Package,      color: 'bg-purple-50 text-purple-600', change: `${lowStock} low stock`, up: null },
  ]

  // Chart data: last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const dayOrders = orders.filter(o => {
      const od = new Date(o.createdAt); return od.toDateString() === d.toDateString()
    })
    return {
      day:     d.toLocaleDateString('en', { weekday: 'short' }),
      revenue: dayOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.total || 0), 0),
      orders:  dayOrders.length,
    }
  })

  const recentOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="stat-card">
            <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center shrink-0`}>
              <s.icon size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{s.value}</p>
              <p className={`text-xs mt-0.5 font-medium ${s.up === true ? 'text-green-600' : s.up === false ? 'text-red-500' : 'text-gray-400'}`}>
                {s.up === true ? '↑' : s.up === false ? '↓' : ''} {s.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-5">Revenue (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#c026d3" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#c026d3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
              <Tooltip formatter={v => formatCurrency(v, currency)}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#c026d3" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Quick Overview</h2>
          <div className="space-y-4">
            {[
              { label: 'Delivered Orders', val: delivered.length, color: 'bg-green-500' },
              { label: 'Pending Orders',   val: pending,          color: 'bg-yellow-500' },
              { label: 'Active Products',  val: products.filter(p => p.active).length, color: 'bg-brand-500' },
              { label: 'Low Stock Items',  val: lowStock,         color: 'bg-red-500' },
              { label: 'Staff Members',    val: staff?.length || 0, color: 'bg-blue-500' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${row.color}`} />
                  <span className="text-sm text-gray-600">{row.label}</span>
                </div>
                <span className="font-bold text-gray-900">{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <span className="badge bg-gray-100 text-gray-600">{orders.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
              {['Customer', 'Items', 'Total', 'Payment', 'Status', 'Time'].map(h => (
                <th key={h} className="px-6 py-3 font-semibold">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-gray-900">{o.customerName}</td>
                  <td className="px-6 py-3.5 text-gray-500">{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}</td>
                  <td className="px-6 py-3.5 font-semibold text-gray-900">{formatCurrency(o.total || 0, currency)}</td>
                  <td className="px-6 py-3.5 text-gray-500">{o.paymentMethod}</td>
                  <td className="px-6 py-3.5"><span className={`badge ${statusColor(o.status)}`}>{o.status}</span></td>
                  <td className="px-6 py-3.5 text-gray-400">{timeAgo(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
