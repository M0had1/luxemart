import { db, getSetting, hashPassword } from './db'

// Rate limiting: max 5 attempts per 15 min
const ATTEMPTS_KEY = 'admin_login_attempts'
const LOCK_KEY     = 'admin_lock_until'

function getAttempts() {
  try { return JSON.parse(sessionStorage.getItem(ATTEMPTS_KEY)) || [] } catch { return [] }
}
function setAttempts(arr) { sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(arr)) }
function getLockUntil()   { return parseInt(sessionStorage.getItem(LOCK_KEY) || '0') }
function setLockUntil(ts) { sessionStorage.setItem(LOCK_KEY, String(ts)) }

export function isRateLimited() {
  const lock = getLockUntil()
  if (lock && Date.now() < lock) return { locked: true, remaining: Math.ceil((lock - Date.now()) / 1000) }
  return { locked: false }
}

export async function adminLogin(email, password) {
  // Rate limit check
  const limit = isRateLimited()
  if (limit.locked) throw new Error(`Too many attempts. Try again in ${limit.remaining}s.`)

  // Purge old attempts (> 15 min)
  const now  = Date.now()
  const attempts = getAttempts().filter(t => now - t < 15 * 60 * 1000)

  const [storedEmail, storedHash] = await Promise.all([
    getSetting('adminEmail'),
    getSetting('adminPassword'),
  ])

  if (email !== storedEmail || hashPassword(password) !== storedHash) {
    attempts.push(now)
    setAttempts(attempts)
    if (attempts.length >= 5) { setLockUntil(now + 15 * 60 * 1000) }
    throw new Error(`Invalid credentials. ${5 - attempts.length} attempts remaining.`)
  }

  // Clear on success
  setAttempts([])
  sessionStorage.removeItem(LOCK_KEY)
  return { email, role: 'admin' }
}

// Obfuscated admin path — only known to the app
export const ADMIN_PATH = '/x8k2-management'
