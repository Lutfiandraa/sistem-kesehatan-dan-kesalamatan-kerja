/**
 * Base URL for static assets (works with Vite and Vercel).
 * Use for images in public/img so paths work after deploy.
 */
const BASE = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
  ? import.meta.env.BASE_URL.replace(/\/$/, '')
  : ''

/**
 * @param {string} path - Path relative to public, e.g. "img/APD.png"
 * @returns {string} Full URL for the asset
 */
export function assetUrl(path) {
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${BASE}/${normalized}`
}
