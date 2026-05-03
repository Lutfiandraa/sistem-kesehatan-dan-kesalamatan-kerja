import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { FaHome, FaEdit, FaHistory, FaCalendarAlt, FaBars, FaTimes } from 'react-icons/fa'

function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <FaHome /> },
    { path: '/report', label: 'Catatan', icon: <FaEdit /> },
    { path: '/history', label: 'Riwayat Pelaporan', icon: <FaHistory /> },
    { path: '/statistics', label: 'Kegiatan', icon: <FaCalendarAlt /> }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-100 h-16 px-4 flex items-center justify-between sticky top-0 z-50 w-full">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img 
            src="/keselamatanlogo.png" 
            alt="SafetyKU Logo" 
            className="h-8 w-8 object-contain"
          />
          <div>
            <span className="text-lg font-bold" style={{ color: '#34C759' }}>SafetyKU</span>
            <p className="text-[10px] text-gray-500 font-medium">Indonesia</p>
          </div>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl text-gray-600 hover:text-gray-900 transition focus:outline-none p-2 rounded-lg hover:bg-gray-50"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        fixed inset-y-0 left-0 bg-white shadow-xl lg:shadow-md border-r border-gray-100 
        w-64 z-50 lg:sticky lg:top-0 h-screen transition-transform duration-300 ease-in-out
        flex flex-col justify-between flex-shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col flex-1">
          {/* Logo Section */}
          <div className="p-6 h-24 border-b border-gray-50 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <img 
                src="/keselamatanlogo.png" 
                alt="SafetyKU Logo" 
                className="h-11 w-11 object-contain"
              />
              <div>
                <span className="text-xl font-bold block leading-tight" style={{ color: '#34C759' }}>SafetyKU</span>
                <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Indonesia</p>
              </div>
            </Link>
            {/* Mobile close button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 text-xl focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-[#34C759] font-bold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                style={isActive(item.path) ? { backgroundColor: '#E8FBF0', color: '#34C759' } : {}}
              >
                <span className={`text-xl transition-colors ${isActive(item.path) ? 'text-[#34C759]' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-medium">&copy; 2026 SafetyKU</p>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </>
  )
}

export default Navbar
