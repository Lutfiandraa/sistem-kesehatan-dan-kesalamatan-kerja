import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function PublicNavbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/catatan', label: 'Catatan' },
    { path: '/riwayat-pelaporan', label: 'Riwayat Pelaporan' },
    { path: '/kegiatan', label: 'Kegiatan' }
  ]

  const isActive = (path) => {
    if (path === '/catatan') {
      // Menu Catatan aktif saat di /catatan, /program-kerja, atau /catatan/pelaporan
      return location.pathname === '/catatan' || 
             location.pathname === '/program-kerja' || 
             location.pathname === '/catatan/pelaporan'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/keselamatanlogo.png" 
              alt="SafetyKU Logo" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <span className="text-xl font-bold" style={{ color: '#34C759' }}>SafetyKU</span>
              <p className="text-xs text-gray-600">Indonesia</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-100' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={isActive(item.path) ? { color: '#34C759' } : {}}
                >
                  {item.label}
                </Link>
                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200">
                    <div className="py-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                          style={{ '--hover-color': '#34C759' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#34C759'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 mt-2">
            <div className="flex flex-col space-y-1 pt-2">
              {navItems.map((item) => (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-primary-100'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={isActive(item.path) ? { color: '#34C759' } : {}}
                  >
                    {item.label}
                  </Link>
                  {item.submenu && (
                    <div className="pl-6 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default PublicNavbar

