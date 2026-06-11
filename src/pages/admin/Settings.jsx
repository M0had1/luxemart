import { useState, useEffect } from 'react'
import { db, getSetting, setSetting, getAllSettings, hashPassword } from '../../lib/db'
import { useSettingsStore } from '../../store/useStore'
import { Save, Store, Palette, DollarSign, Truck, Lock, Globe, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const Section = ({ icon: Icon, title, children }) => (
  <div className="card p-6">
    <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
      <Icon size={18} className="text-brand-600" />{title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
)
const F = ({ label, hint, children }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
    {children}
  </div>
)

export default function Settings() {
  const { settings, setSettings } = useSettingsStore()
  const [form, setForm]   = useState({})
  const [saving, setSaving] = useState(false)
  const [tab, setTab]     = useState('store')
  const [showPw, setShowPw] = useState(false)
  const [newPw, setNewPw]   = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  useEffect(() => { if (settings && Object.keys(settings).length) setForm({ ...settings }) }, [settings])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const skip = ['adminPassword', 'seeded']
      for (const [k, v] of Object.entries(form)) {
        if (!skip.includes(k)) await setSetting(k, v)
      }
      // Password change?
      if (newPw) {
        if (newPw !== confirmPw) { toast.error('Passwords do not match'); setSaving(false); return }
        if (newPw.length < 6)    { toast.error('Password too short'); setSaving(false); return }
        await setSetting('adminPassword', hashPassword(newPw))
        setNewPw(''); setConfirmPw('')
        toast.success('Password updated')
      }
      const updated = await getAllSettings()
      setSettings(updated)
      toast.success('Settings saved!')
    } catch { toast.error('Failed to save settings') }
    finally { setSaving(false) }
  }

  const TABS = [
    { id: 'store',    label: 'Store Info',  icon: Store },
    { id: 'commerce', label: 'Commerce',    icon: DollarSign },
    { id: 'social',   label: 'Social',      icon: Globe },
    { id: 'security', label: 'Security',    icon: Lock },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure every aspect of your store</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border
              ${tab === t.id ? 'bg-brand-600 text-white border-brand-600 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300'}`}>
            <t.icon size={15} />{t.label}
          </button>
        ))}
      </div>

      <form onSubmit={save}>
        {tab === 'store' && (
          <div className="space-y-5">
            <Section icon={Store} title="Store Identity">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Store Name"><input className="input" value={form.appName || ''} onChange={e => set('appName', e.target.value)} /></F>
                <F label="Tagline"><input className="input" value={form.appTagline || ''} onChange={e => set('appTagline', e.target.value)} /></F>
                <F label="Logo Emoji" hint="Paste an emoji as your logo"><input className="input" value={form.logo || ''} onChange={e => set('logo', e.target.value)} maxLength={4} /></F>
                <F label="Contact Email"><input type="email" className="input" value={form.contactEmail || ''} onChange={e => set('contactEmail', e.target.value)} /></F>
                <F label="Contact Phone"><input className="input" value={form.contactPhone || ''} onChange={e => set('contactPhone', e.target.value)} /></F>
              </div>
              <F label="About Text">
                <textarea className="input" rows={3} value={form.aboutText || ''} onChange={e => set('aboutText', e.target.value)} />
              </F>
            </Section>
          </div>
        )}

        {tab === 'commerce' && (
          <div className="space-y-5">
            <Section icon={DollarSign} title="Currency & Pricing">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Currency Symbol"><input className="input" value={form.currency || ''} onChange={e => set('currency', e.target.value)} placeholder="KSh" /></F>
                <F label="Currency Code"><input className="input" value={form.currencyCode || ''} onChange={e => set('currencyCode', e.target.value)} placeholder="KES" /></F>
                <F label="Tax Rate (%)"><input type="number" className="input" value={form.taxRate || ''} onChange={e => set('taxRate', parseFloat(e.target.value))} min="0" max="100" /></F>
              </div>
            </Section>
            <Section icon={Truck} title="Shipping">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Shipping Fee"><input type="number" className="input" value={form.shippingFee || ''} onChange={e => set('shippingFee', parseFloat(e.target.value))} min="0" /></F>
                <F label="Free Shipping Threshold" hint="Orders above this get free shipping">
                  <input type="number" className="input" value={form.freeShippingThreshold || ''} onChange={e => set('freeShippingThreshold', parseFloat(e.target.value))} min="0" />
                </F>
              </div>
            </Section>
          </div>
        )}

        {tab === 'social' && (
          <Section icon={Globe} title="Social Media Links">
            <div className="space-y-4">
              <F label="Facebook URL"><input className="input" value={form.socialFacebook || ''} onChange={e => set('socialFacebook', e.target.value)} placeholder="https://facebook.com/…" /></F>
              <F label="Instagram URL"><input className="input" value={form.socialInstagram || ''} onChange={e => set('socialInstagram', e.target.value)} placeholder="https://instagram.com/…" /></F>
              <F label="Twitter / X URL"><input className="input" value={form.socialTwitter || ''} onChange={e => set('socialTwitter', e.target.value)} placeholder="https://twitter.com/…" /></F>
            </div>
          </Section>
        )}

        {tab === 'security' && (
          <Section icon={Lock} title="Admin Credentials">
            <F label="Admin Email">
              <input type="email" className="input" value={form.adminEmail || ''} onChange={e => set('adminEmail', e.target.value)} />
            </F>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
              ⚠️ Changing the admin email will require you to use the new email on next login.
            </div>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">Change Password</p>
              <div className="space-y-3">
                <F label="New Password">
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} className="input pr-10" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Leave blank to keep current" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </F>
                <F label="Confirm New Password">
                  <input type="password" className="input" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
                </F>
              </div>
            </div>
          </Section>
        )}

        <div className="flex justify-end pt-2">
          <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={saving} className="btn-primary">
            <Save size={16} />{saving ? 'Saving…' : 'Save Settings'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}
