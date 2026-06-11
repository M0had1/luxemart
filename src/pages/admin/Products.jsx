import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { useSettingsStore } from '../../store/useStore'
import { formatCurrency } from '../../lib/utils'
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Confirm from '../../components/ui/Confirm'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const EMPTY = { name: '', price: '', originalPrice: '', category: '', stock: '', image: '', description: '', featured: false, active: true, rating: 4.5, reviews: 0, sold: 0 }

export default function Products() {
  const { settings } = useSettingsStore()
  const currency = settings.currency || 'KSh'
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(EMPTY)
  const [search, setSearch] = useState('')
  const [delId, setDelId]   = useState(null)
  const [saving, setSaving] = useState(false)

  const products   = useLiveQuery(() => db.products.toArray(), [])
  const categories = useLiveQuery(() => db.categories.toArray(), [])

  const filtered = (products || []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const openNew  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (p)  => { setEditing(p); setForm({ ...p, price: String(p.price), originalPrice: String(p.originalPrice || ''), stock: String(p.stock) }); setModal(true) }

  const save = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return toast.error('Name and price are required')
    setSaving(true)
    const data = { ...form, price: parseFloat(form.price), originalPrice: parseFloat(form.originalPrice) || null, stock: parseInt(form.stock) || 0, active: !!form.active, featured: !!form.featured }
    try {
      if (editing) { await db.products.update(editing.id, data); toast.success('Product updated') }
      else          { await db.products.add({ ...data, createdAt: new Date() }); toast.success('Product added') }
      setModal(false)
    } catch(e) { toast.error('Error saving product') }
    finally { setSaving(false) }
  }

  const del  = async () => { await db.products.delete(delId); toast.success('Product deleted'); setDelId(null) }
  const toggle = async (p) => { await db.products.update(p.id, { active: !p.active }); toast.success(p.active ? 'Product hidden' : 'Product visible') }

  const F = ({ label, children }) => (
    <div><label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>{children}</div>
  )

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{(products || []).length} products total</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm self-start">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
              {['Product', 'Category', 'Price', 'Stock', 'Sold', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 font-semibold">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-11 h-11 object-cover rounded-lg shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                        {p.featured && <span className="badge bg-brand-100 text-brand-700 text-[10px] mt-0.5">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p.category}</td>
                  <td className="px-5 py-3.5 font-semibold">{formatCurrency(p.price, currency)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-semibold ${p.stock < 5 ? 'text-red-600' : 'text-gray-900'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p.sold || 0}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggle(p)} className="flex items-center gap-1.5 text-gray-500 hover:text-brand-600 transition-colors">
                      {p.active ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} />}
                      <span className={`text-xs font-medium ${p.active ? 'text-green-600' : 'text-gray-400'}`}>{p.active ? 'Active' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-brand-50 text-brand-600 rounded-lg transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => setDelId(p.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Product' : 'Add New Product'} size="lg">
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><F label="Product Name *"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></F></div>
            <F label="Price *"><input type="number" className="input" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min="0" step="0.01" /></F>
            <F label="Original Price (for discount)"><input type="number" className="input" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} min="0" step="0.01" /></F>
            <F label="Category">
              <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">Select…</option>
                {(categories || []).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </F>
            <F label="Stock"><input type="number" className="input" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} min="0" /></F>
            <div className="col-span-2"><F label="Image URL"><input className="input" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://…" /></F></div>
            <div className="col-span-2"><F label="Description"><textarea className="input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></F></div>
            <div className="flex items-center gap-2 col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-brand-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">Featured product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer ml-6">
                <input type="checkbox" checked={!!form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-brand-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">Active (visible in store)</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Product'}</button>
          </div>
        </form>
      </Modal>

      <Confirm open={!!delId} onClose={() => setDelId(null)} onConfirm={del}
        title="Delete Product" message="Are you sure you want to delete this product? This cannot be undone." danger />
    </div>
  )
}
