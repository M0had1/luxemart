import Dexie from 'dexie'
import CryptoJS from 'crypto-js'

export const db = new Dexie('LuxeMartDB')

db.version(1).stores({
  settings:  'key',
  products:  '++id, category, featured, active',
  orders:    '++id, status, createdAt, customerId',
  customers: '++id, email',
  staff:     '++id, email, role',
  categories:'++id, name',
  reviews:   '++id, productId',
})

// ── Hash helper ──────────────────────────────────────────────
export const hashPassword = (pw) => CryptoJS.SHA256(pw).toString()

// ── Seed default data ────────────────────────────────────────
export async function seedDatabase() {
  const existing = await db.settings.get('seeded')
  if (existing) return

  // Default settings
  await db.settings.bulkPut([
    { key: 'appName',       value: 'LuxeMart' },
    { key: 'appTagline',    value: 'Premium Shopping, Redefined.' },
    { key: 'logo',          value: '💎' },
    { key: 'primaryColor',  value: '#c026d3' },
    { key: 'currency',      value: 'KSh' },
    { key: 'currencyCode',  value: 'KES' },
    { key: 'adminEmail',    value: 'mohadez2002@gmail.com' },
    { key: 'adminPassword', value: hashPassword('Mohamm3d1') },
    { key: 'taxRate',       value: 16 },
    { key: 'shippingFee',   value: 250 },
    { key: 'freeShippingThreshold', value: 5000 },
    { key: 'aboutText',     value: 'LuxeMart brings you the finest products curated for quality and style.' },
    { key: 'contactEmail',  value: 'support@luxemart.com' },
    { key: 'contactPhone',  value: '+254 700 000 000' },
    { key: 'socialFacebook',value: '' },
    { key: 'socialInstagram',value: '' },
    { key: 'socialTwitter', value: '' },
    { key: 'seeded',        value: true },
  ])

  // Default categories
  await db.categories.bulkAdd([
    { name: 'Electronics', icon: '📱', active: true },
    { name: 'Fashion',     icon: '👗', active: true },
    { name: 'Home & Living', icon: '🏠', active: true },
    { name: 'Beauty',      icon: '✨', active: true },
    { name: 'Sports',      icon: '⚽', active: true },
  ])

  // Seed products
  const products = [
    { name: 'Premium Wireless Headphones', price: 8500, originalPrice: 12000, category: 'Electronics', stock: 45, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', description: 'Experience crystal-clear sound with active noise cancellation and 30-hour battery life.', featured: true, active: true, sold: 23, rating: 4.8, reviews: 156 },
    { name: 'Luxury Silk Dress', price: 5500, originalPrice: 7500, category: 'Fashion', stock: 18, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', description: 'Elegant 100% silk dress perfect for any occasion. Available in multiple colors.', featured: true, active: true, sold: 67, rating: 4.9, reviews: 89 },
    { name: 'Smart Watch Pro', price: 15000, originalPrice: 20000, category: 'Electronics', stock: 30, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', description: 'Track your fitness, receive notifications and pay contactless with this premium smart watch.', featured: true, active: true, sold: 41, rating: 4.7, reviews: 203 },
    { name: 'Minimalist Desk Lamp', price: 3200, originalPrice: 4000, category: 'Home & Living', stock: 60, image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&q=80', description: 'Modern LED desk lamp with touch dimmer and USB charging port.', featured: false, active: true, sold: 112, rating: 4.6, reviews: 78 },
    { name: 'Vitamin C Serum', price: 2800, originalPrice: 3500, category: 'Beauty', stock: 80, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', description: 'Professional-grade Vitamin C serum for radiant, youthful skin.', featured: true, active: true, sold: 189, rating: 4.9, reviews: 312 },
    { name: 'Running Shoes Elite', price: 7200, originalPrice: 9500, category: 'Sports', stock: 25, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', description: 'Lightweight performance running shoes with responsive cushioning.', featured: false, active: true, sold: 55, rating: 4.7, reviews: 144 },
    { name: 'Leather Wallet', price: 1800, originalPrice: 2500, category: 'Fashion', stock: 90, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80', description: 'Genuine leather bifold wallet with RFID protection.', featured: false, active: true, sold: 234, rating: 4.5, reviews: 421 },
    { name: 'Espresso Machine', price: 18000, originalPrice: 24000, category: 'Home & Living', stock: 12, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', description: 'Professional-grade espresso machine for the perfect brew every morning.', featured: true, active: true, sold: 29, rating: 4.8, reviews: 67 },
  ]
  await db.products.bulkAdd(products.map(p => ({ ...p, createdAt: new Date() })))

  // Seed sample orders
  const now = Date.now()
  const orderData = [
    { customerName: 'Alice Wanjiru', customerEmail: 'alice@example.com', items: [{ productId: 1, name: 'Premium Wireless Headphones', price: 8500, qty: 1 }], subtotal: 8500, tax: 1360, shipping: 0, total: 9860, status: 'delivered', createdAt: now - 86400000 * 5, paymentMethod: 'M-Pesa' },
    { customerName: 'Brian Ochieng', customerEmail: 'brian@example.com', items: [{ productId: 3, name: 'Smart Watch Pro', price: 15000, qty: 1 }, { productId: 7, name: 'Leather Wallet', price: 1800, qty: 2 }], subtotal: 18600, tax: 2976, shipping: 0, total: 21576, status: 'processing', createdAt: now - 86400000 * 2, paymentMethod: 'Card' },
    { customerName: 'Carol Mwangi', customerEmail: 'carol@example.com', items: [{ productId: 5, name: 'Vitamin C Serum', price: 2800, qty: 2 }], subtotal: 5600, tax: 896, shipping: 0, total: 6496, status: 'shipped', createdAt: now - 86400000 * 1, paymentMethod: 'M-Pesa' },
    { customerName: 'David Kamau', customerEmail: 'david@example.com', items: [{ productId: 8, name: 'Espresso Machine', price: 18000, qty: 1 }], subtotal: 18000, tax: 2880, shipping: 0, total: 20880, status: 'pending', createdAt: now - 3600000 * 3, paymentMethod: 'Card' },
    { customerName: 'Eve Otieno', customerEmail: 'eve@example.com', items: [{ productId: 2, name: 'Luxury Silk Dress', price: 5500, qty: 1 }, { productId: 6, name: 'Running Shoes Elite', price: 7200, qty: 1 }], subtotal: 12700, tax: 2032, shipping: 0, total: 14732, status: 'delivered', createdAt: now - 86400000 * 7, paymentMethod: 'M-Pesa' },
  ]
  await db.orders.bulkAdd(orderData)

  // Default staff
  await db.staff.add({ name: 'Super Admin', email: 'mohadez2002@gmail.com', role: 'admin', active: true, createdAt: new Date() })
}

// ── Settings helpers ─────────────────────────────────────────
export async function getSetting(key) {
  const row = await db.settings.get(key)
  return row ? row.value : null
}
export async function setSetting(key, value) {
  return db.settings.put({ key, value })
}
export async function getAllSettings() {
  const rows = await db.settings.toArray()
  return Object.fromEntries(rows.map(r => [r.key, r.value]))
}
