import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { seedDatabase, getAllSettings } from './lib/db'
import { useAdminStore, useSettingsStore } from './store/useStore'
import { ADMIN_PATH } from './lib/auth'

// Shop layout
import Navbar from './components/shop/Navbar'
import CartDrawer from './components/shop/CartDrawer'
import Footer from './components/shop/Footer'

// Shop pages
import HomePage       from './pages/shop/HomePage'
import ShopPage       from './pages/shop/ShopPage'
import ProductPage    from './pages/shop/ProductPage'
import CheckoutPage   from './pages/shop/CheckoutPage'
import AboutPage      from './pages/shop/AboutPage'
import ContactPage    from './pages/shop/ContactPage'

// Admin
import AdminLogin  from './pages/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard   from './pages/admin/Dashboard'
import Products    from './pages/admin/Products'
import Orders      from './pages/admin/Orders'
import Staff       from './pages/admin/Staff'
import Settings    from './pages/admin/Settings'

function ShopLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}

function RequireAdmin() {
  const { isLoggedIn } = useAdminStore()
  return isLoggedIn ? <Outlet /> : <Navigate to={ADMIN_PATH} replace />
}

export default function App() {
  const { setSettings } = useSettingsStore()

  useEffect(() => {
    ;(async () => {
      await seedDatabase()
      const s = await getAllSettings()
      setSettings(s)
    })()
  }, [])

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Shop */}
        <Route element={<ShopLayout />}>
          <Route path="/"           element={<HomePage />} />
          <Route path="/shop"       element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout"   element={<CheckoutPage />} />
          <Route path="/about"      element={<AboutPage />} />
          <Route path="/contact"    element={<ContactPage />} />
          <Route path="/privacy"    element={<div className="max-w-2xl mx-auto px-4 py-16"><h1 className="font-display text-3xl font-bold mb-4">Privacy Policy</h1><p className="text-gray-600">We respect your privacy and protect your personal data.</p></div>} />
          <Route path="/terms"      element={<div className="max-w-2xl mx-auto px-4 py-16"><h1 className="font-display text-3xl font-bold mb-4">Terms of Service</h1><p className="text-gray-600">By using LuxeMart, you agree to our terms and conditions.</p></div>} />
        </Route>

        {/* Admin login — secret path */}
        <Route path={ADMIN_PATH} element={<AdminLogin />} />

        {/* Protected Admin panel */}
        <Route element={<RequireAdmin />}>
          <Route path={ADMIN_PATH} element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products"  element={<Products />} />
            <Route path="orders"    element={<Orders />} />
            <Route path="staff"     element={<Staff />} />
            <Route path="settings"  element={<Settings />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
