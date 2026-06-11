import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import { useSettingsStore } from '../../store/useStore'

export default function Footer() {
  const { settings } = useSettingsStore()
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">{settings.logo || '💎'}</span>
              <span className="font-display text-2xl font-bold text-white">{settings.appName || 'LuxeMart'}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {settings.aboutText || 'Premium products curated for quality and style.'}
            </p>
            <div className="flex gap-3 mt-6">
              {settings.socialFacebook && <a href={settings.socialFacebook} target="_blank" rel="noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors text-sm font-bold">f</a>}
              {settings.socialInstagram && <a href={settings.socialInstagram} target="_blank" rel="noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors text-sm font-bold">in</a>}
              {settings.socialTwitter && <a href={settings.socialTwitter} target="_blank" rel="noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors text-sm font-bold">𝕏</a>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['/', '/shop', '/about', '/contact'].map((to, i) => (
                <li key={to}><Link to={to} className="hover:text-brand-400 transition-colors">
                  {['Home', 'Shop', 'About Us', 'Contact'][i]}
                </Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              {settings.contactEmail && (
                <li className="flex items-center gap-2"><Mail size={14} className="text-brand-400 shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                    {settings.contactEmail}</a></li>
              )}
              {settings.contactPhone && (
                <li className="flex items-center gap-2"><Phone size={14} className="text-brand-400 shrink-0" />
                  <span>{settings.contactPhone}</span></li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} {settings.appName || 'LuxeMart'}. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
