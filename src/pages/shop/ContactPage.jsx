import { useState } from 'react'
import { Mail, Phone, Send } from 'lucide-react'
import { useSettingsStore } from '../../store/useStore'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const { settings } = useSettingsStore()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const submit = (e) => { e.preventDefault(); toast.success('Message sent! We\'ll get back to you shortly.'); setForm({ name: '', email: '', message: '' }) }
  return (
    <div className="page-enter max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">We'd love to hear from you. Send us a message!</p>
      <div className="flex gap-6 mb-8 flex-wrap text-sm text-gray-600">
        {settings.contactEmail && <div className="flex items-center gap-2"><Mail size={16} className="text-brand-600" />{settings.contactEmail}</div>}
        {settings.contactPhone && <div className="flex items-center gap-2"><Phone size={16} className="text-brand-600" />{settings.contactPhone}</div>}
      </div>
      <form onSubmit={submit} className="card p-8 space-y-4">
        <div><label className="text-sm font-medium text-gray-700 mb-1 block">Name</label><input className="input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required /></div>
        <div><label className="text-sm font-medium text-gray-700 mb-1 block">Email</label><input type="email" className="input" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} required /></div>
        <div><label className="text-sm font-medium text-gray-700 mb-1 block">Message</label><textarea className="input" rows={4} value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))} required /></div>
        <button type="submit" className="btn-primary"><Send size={16} /> Send Message</button>
      </form>
    </div>
  )
}
