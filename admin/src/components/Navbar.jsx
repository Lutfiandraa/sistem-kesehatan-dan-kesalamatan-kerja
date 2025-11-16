import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaChartBar, FaEdit, FaClipboardList, FaChartLine } from 'react-icons/fa'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { path: '/report', label: 'Pelaporan', icon: <FaEdit /> },
    { path: '/history', label: 'Riwayat', icon: <FaClipboardList /> },
    { path: '/statistics', label: 'Statistik', icon: <FaChartLine /> }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo dan Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <img 
                src="/keselamatanlogo.png" 
                alt="SafetyKU Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold text-green-700">SafetyKU</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-700">
              <span className="font-medium">{user?.full_name || 'User'}</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive(item.path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar





