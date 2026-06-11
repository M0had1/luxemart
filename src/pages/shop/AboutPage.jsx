import { useSettingsStore } from '../../store/useStore'
export default function AboutPage() {
  const { settings } = useSettingsStore()
  return (
    <div className="page-enter max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">{settings.logo || '💎'}</div>
      <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">{settings.appName || 'LuxeMart'}</h1>
      <p className="text-gray-600 text-lg leading-relaxed">{settings.aboutText || 'Premium products curated for quality and style.'}</p>
    </div>
  )
}
