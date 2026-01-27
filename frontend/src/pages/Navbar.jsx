import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/catatan', label: 'Regulatory' },
    { path: '/kegiatan', label: 'Activity' }
  ]

  // Handle scroll untuk hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 10)

      // Hide navbar saat scroll ke bawah, show saat scroll ke atas
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsNavbarVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsNavbarVisible(true)
      }

      // Always show navbar at the top
      if (currentScrollY < 10) {
        setIsNavbarVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <>
      {/* Main Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 shadow-md`}
        style={{ 
          backgroundColor: '#252525',
          transform: isNavbarVisible ? 'translateY(0)' : 'translateY(-100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <img 
                src="/keselamatanlogo.png" 
                alt="SafetyKU Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain"
              />
              <div className="hidden sm:block">
                <span className="text-lg sm:text-xl md:text-2xl font-bold block" style={{ color: '#34C759' }}>
                  SafetyKU
                </span>
                <span className="text-[10px] sm:text-xs" style={{ color: '#b0b0b0' }}>Indonesia</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => {
                const isItemActive = isActive(item.path)
                const isItemHovered = hoveredItem === item.path
                const showActiveUnderline = isItemActive && !hoveredItem
                const showHoverUnderline = isItemHovered
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                  className={`relative px-4 xl:px-6 py-2 text-sm xl:text-base font-medium transition-all duration-200 ${
                    isItemActive || isItemHovered
                      ? 'text-primary-600' 
                      : 'hover:text-primary-600'
                  }`}
                  style={{ color: isItemActive || isItemHovered ? '#34C759' : '#e5e5e5' }}
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {item.label}
                    {/* Active underline - visible only when no item is hovered */}
                    {showActiveUnderline && (
                      <span 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 transition-opacity duration-300"
                        style={{ backgroundColor: '#34C759' }}
                      ></span>
                    )}
                    {/* Hover underline - appears on hover */}
                    {showHoverUnderline && (
                      <span 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 transition-all duration-300 ease-in-out origin-left"
                        style={{ backgroundColor: '#34C759' }}
                      ></span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: '#e5e5e5' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label="Toggle menu"
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
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-4 pt-2 border-t" style={{ backgroundColor: '#252525', borderColor: '#404040' }}>
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-base font-medium transition-colors"
                  style={isActive(item.path) ? { 
                    backgroundColor: 'rgba(52, 199, 89, 0.15)', 
                    color: '#34C759' 
                  } : {
                    color: '#e5e5e5'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = '#3a3a3a'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar

