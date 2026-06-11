import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { Plus, Trash2, Pencil, ShieldCheck, User, Eye } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Confirm from '../../components/ui/Confirm'
import toast from 'react-hot-toast'
import { formatDate } from '../../lib/utils'

const ROLES = ['admin', 'manager', 'support', 'viewer']
const ROLE_COLORS = { admin: 'bg-red-100 text-red-700', manager: 'bg-brand-100 text-brand-700', support: 'bg-blue-100 text-blue-700', viewer: 'bg-gray-100 text-gray-600' }
const ROLE_PERMS = {
  admin:   ['Full system access', 'Manage staff', 'View financials', 'Edit settings'],
  manager: ['Manage products', 'Manage orders', 'View reports'],
  support: ['View orders', 'Update order status', 'View products'],
  viewer:  ['View dashboard', 'View reports (read-only)'],
}

const EMPTY = { name: '', email: '', role: 'manager', active: true }

export default function Staff() {
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(EMPTY)
  const [delId, setDelId]   = useState(null)
  const [viewing, setViewing] = useState(null)

  const staff = useLiveQuery(() => db.staff.toArray(), [])
  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openNew  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (s) => { setEditing(s);   setForm({ ...s }); setModal(true) }

  const save = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return toast.error('Name and email required')
    try {
      if (editing) { await db.staff.update(editing.id, form); toast.success('Staff updated') }
      else { await db.staff.add({ ...form, createdAt: new Date() }); toast.success('Staff member added') }
      setModal(false)
    } catch { toast.error('Error saving') }
  }

  const del = async () => { await db.staff.delete(delId); toast.success('Staff removed'); setDelId(null) }

  const F = ({ label, children }) => <div><label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>{children}</div>

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{(staff || []).length} team members</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={16} /> Add Staff</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(staff || []).map(s => (
          <div key={s.id} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.email}</p>
                </div>
              </div>
              <span className={`badge ${ROLE_COLORS[s.role] || 'bg-gray-100 text-gray-600'}`}>{s.role}</span>
            </div>
            <div className="text-xs text-gray-400 mb-4">
              Added {s.createdAt ? formatDate(new Date(s.createdAt).getTime()) : '—'}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setViewing(s)} className="btn-ghost text-xs px-3 py-1.5 flex-1 justify-center"><Eye size={13} /> Permissions</button>
              <button onClick={() => openEdit(s)}   className="btn-ghost text-xs px-3 py-1.5"><Pencil size={13} /></button>
              {s.role !== 'admin' && (
                <button onClick={() => setDelId(s.id)} className="btn-ghost text-xs px-3 py-1.5 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Role Permissions Reference */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-brand-600" /> Role Permissions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ROLES.map(role => (
            <div key={role} className="bg-gray-50 rounded-xl p-4">
              <span className={`badge ${ROLE_COLORS[role]} mb-3 block w-fit`}>{role}</span>
              <ul className="space-y-1.5">
                {ROLE_PERMS[role].map(p => (
                  <li key={p} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Staff' : 'Add Staff Member'} size="sm">
        <form onSubmit={save} className="space-y-4">
          <F label="Full Name *"><input className="input" value={form.name} onChange={e => set('name', e.target.value)} required /></F>
          <F label="Email *"><input type="email" className="input" value={form.email} onChange={e => set('email', e.target.value)} required /></F>
          <F label="Role">
            <select className="input" value={form.role} onChange={e => set('role', e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </F>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.active} onChange={e => set('active', e.target.checked)} className="accent-brand-600 w-4 h-4" />
            <span className="text-sm font-medium text-gray-700">Active account</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" className="btn-primary text-sm">{editing ? 'Save' : 'Add Staff'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`${viewing?.name} — Permissions`} size="sm">
        {viewing && (
          <div>
            <div className="flex items-center gap-3 mb-5 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {viewing.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{viewing.name}</p>
                <span className={`badge ${ROLE_COLORS[viewing.role]}`}>{viewing.role}</span>
              </div>
            </div>
            <ul className="space-y-2">
              {(ROLE_PERMS[viewing.role] || []).map(p => (
                <li key={p} className="flex items-center gap-2 text-sm text-gray-700 py-2 border-b border-gray-50">
                  <ShieldCheck size={15} className="text-green-500 shrink-0" />{p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      <Confirm open={!!delId} onClose={() => setDelId(null)} onConfirm={del}
        title="Remove Staff" message="Remove this staff member? This action cannot be undone." danger />
    </div>
  )
}
