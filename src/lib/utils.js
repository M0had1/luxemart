export function formatCurrency(amount, currency = 'KSh') {
  return `${currency} ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function timeAgo(ts) {
  const diff = Date.now() - ts
  if (diff < 60000)    return 'just now'
  if (diff < 3600000)  return `${Math.floor(diff/60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`
  return `${Math.floor(diff/86400000)}d ago`
}

export function statusColor(status) {
  return {
    pending:    'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped:    'bg-purple-100 text-purple-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
    refunded:   'bg-gray-100 text-gray-700',
  }[status] || 'bg-gray-100 text-gray-700'
}

export function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export function generateOrderId() {
  return 'LM' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(-3).toUpperCase()
}

export function clamp(n, min, max) { return Math.min(Math.max(n, min), max) }

export const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
