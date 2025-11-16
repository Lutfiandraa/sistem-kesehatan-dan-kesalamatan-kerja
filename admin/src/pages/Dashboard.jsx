import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { useState, useEffect } from 'react'
import { FaChartBar, FaHourglassHalf, FaCheckCircle, FaCalendar, FaEdit, FaClipboardList, FaChartLine } from 'react-icons/fa'

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    thisMonth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/incidents')
      const incidents = response.data.data.incidents || []
      
      const total = incidents.length
      const pending = incidents.filter(i => i.status === 'pending').length
      const resolved = incidents.filter(i => i.status === 'resolved' || i.status === 'closed').length
      
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()
      const thisMonthIncidents = incidents.filter(i => {
        const date = new Date(i.created_at)
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear
      }).length

      setStats({ total, pending, resolved, thisMonth: thisMonthIncidents })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Selamat Datang, {user?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Sistem Pelaporan Keselamatan dan Kesehatan Kerja
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderColor: '#34C759' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Laporan</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : stats.total}
              </p>
            </div>
            <div className="text-4xl text-gray-600">
              <FaChartBar />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Menunggu</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : stats.pending}
              </p>
            </div>
            <div className="text-4xl text-gray-600">
              <FaHourglassHalf />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Selesai</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : stats.resolved}
              </p>
            </div>
            <div className="text-4xl text-green-500">
              <FaCheckCircle />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : stats.thisMonth}
              </p>
            </div>
            <div className="text-4xl text-gray-600">
              <FaCalendar />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/report"
            className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-all border border-green-200"
          >
            <div className="text-3xl mr-4 text-gray-600">
              <FaEdit />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Laporkan Insiden</h3>
              <p className="text-sm text-gray-600">Buat laporan insiden baru</p>
            </div>
          </Link>

          <Link
            to="/history"
            className="flex items-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-all border"
            style={{ borderColor: '#a3e3b7' }}
          >
            <div className="text-3xl mr-4 text-gray-600">
              <FaClipboardList />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Riwayat Laporan</h3>
              <p className="text-sm text-gray-600">Lihat semua laporan</p>
            </div>
          </Link>

          <Link
            to="/statistics"
            className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all border border-purple-200"
          >
            <div className="text-3xl mr-4 text-gray-600">
              <FaChartLine />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Statistik</h3>
              <p className="text-sm text-gray-600">Analisis data laporan</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang SafetyKU</h2>
          <p className="text-gray-600 mb-4">
            SafetyKU adalah sistem pelaporan keselamatan dan kesehatan kerja yang 
            dirancang untuk memudahkan pelaporan insiden, monitoring, dan analisis 
            data keselamatan kerja.
          </p>
          <p className="text-gray-600">
            Sistem ini membantu organisasi dalam mengelola dan mencegah insiden 
            keselamatan kerja dengan lebih efektif.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">K3 Indonesia</h2>
          <p className="text-gray-600 mb-4">
            Keselamatan dan Kesehatan Kerja (K3) adalah upaya untuk menciptakan 
            tempat kerja yang aman, sehat, dan bebas dari pencemaran lingkungan.
          </p>
          <p className="text-gray-600">
            Dengan menerapkan K3, kita dapat mencegah kecelakaan kerja dan penyakit 
            akibat kerja, serta meningkatkan produktivitas.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

