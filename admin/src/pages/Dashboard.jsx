import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { useState, useEffect } from 'react'
import { FaChartBar, FaHourglassHalf, FaCheckCircle, FaCalendar, FaEdit, FaClipboardList, FaChartLine, FaExclamationTriangle } from 'react-icons/fa'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    thisMonth: 0,
    byType: {},
    bySeverity: {},
    byStatus: {}
  })
  const [trendData, setTrendData] = useState([])
  const [pieData, setPieData] = useState([])
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

      // Group by type
      const byType = {}
      incidents.forEach(incident => {
        byType[incident.incident_type] = (byType[incident.incident_type] || 0) + 1
      })

      // Group by severity
      const bySeverity = {}
      incidents.forEach(incident => {
        bySeverity[incident.severity] = (bySeverity[incident.severity] || 0) + 1
      })

      // Group by status
      const byStatus = {}
      incidents.forEach(incident => {
        byStatus[incident.status] = (byStatus[incident.status] || 0) + 1
      })

      setStats({ total, pending, resolved, thisMonth: thisMonthIncidents, byType, bySeverity, byStatus })

      // Generate 6-month trends for Recharts
      const now = new Date()
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
      const monthlyArray = []

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const mLabel = monthNames[d.getMonth()]
        
        const count = incidents.filter(inc => {
          const incDate = new Date(inc.created_at)
          return incDate.getMonth() === d.getMonth() && incDate.getFullYear() === d.getFullYear()
        }).length

        monthlyArray.push({
          name: mLabel,
          insiden: count
        })
      }
      setTrendData(monthlyArray)

      // Status pie chart data
      setPieData([
        { name: 'Selesai', value: resolved, color: '#34C759' },
        { name: 'Menunggu', value: pending, color: '#FFB302' },
        { name: 'Sisa', value: Math.max(0, total - resolved - pending), color: '#3B82F6' }
      ])
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeLabel = (type) => {
    const labels = {
      near_miss: 'Near Miss',
      injury: 'Cedera',
      property_damage: 'Kerusakan Properti',
      unsafe_condition: 'Kondisi Tidak Aman',
      unsafe_behavior: 'Perilaku Tidak Aman',
      other: 'Lainnya'
    }
    return labels[type] || type
  }

  const getSeverityLabel = (severity) => {
    const labels = { low: 'Rendah', medium: 'Sedang', high: 'Tinggi', critical: 'Kritis' }
    return labels[severity] || severity
  }

  const getStatusLabel = (status) => {
    const labels = { pending: 'Menunggu', under_review: 'Ditinjau', resolved: 'Selesai', closed: 'Ditutup' }
    return labels[status] || status
  }

  const typeData = Object.entries(stats.byType).map(([type, count]) => ({
    name: getTypeLabel(type),
    jumlah: count
  }))

  const severityColors = { low: '#10B981', medium: '#F59E0B', high: '#EF4444', critical: '#7F1D1D' }

  const severityData = Object.entries(stats.bySeverity).map(([severity, count]) => ({
    name: getSeverityLabel(severity),
    value: count,
    color: severityColors[severity] || '#6B7280'
  }))

  const statusData = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: getStatusLabel(status),
    laporan: count
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 animate-fade-in select-none">
      {/* Welcome Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-1 select-none">
            Selamat Datang, {user?.full_name || 'User'}!
          </h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">
            Sistem Pelaporan Keselamatan dan Kesehatan Kerja (K3) Indonesia
          </p>
        </div>
        <div className="flex items-center space-x-2.5 bg-white border border-gray-100/80 px-4 py-2.5 rounded-xl shadow-sm select-none">
          <span className="text-2xl text-[#34C759]"><FaCheckCircle /></span>
          <div>
            <span className="text-xs font-medium text-gray-500 block leading-tight">Status K3</span>
            <span className="text-sm font-semibold text-gray-800">Aktif & Terpantau</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 select-none animate-fade-in">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition duration-200" style={{ borderColor: '#34C759' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Laporan</p>
              <p className="text-3xl font-black text-gray-900 mt-2">
                {loading ? '...' : stats.total}
              </p>
            </div>
            <div className="text-4xl text-gray-300">
              <FaChartBar />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Menunggu</p>
              <p className="text-3xl font-black text-gray-900 mt-2">
                {loading ? '...' : stats.pending}
              </p>
            </div>
            <div className="text-4xl text-gray-300">
              <FaHourglassHalf />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Selesai</p>
              <p className="text-3xl font-black text-gray-900 mt-2">
                {loading ? '...' : stats.resolved}
              </p>
            </div>
            <div className="text-4xl text-green-300">
              <FaCheckCircle />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bulan Ini</p>
              <p className="text-3xl font-black text-gray-900 mt-2">
                {loading ? '...' : stats.thisMonth}
              </p>
            </div>
            <div className="text-4xl text-gray-300">
              <FaCalendar />
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Data Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Tren Bulanan Insiden</h3>
            <p className="text-xs text-gray-500 font-medium mb-4">Tren data insiden yang terekam dalam 6 bulan terakhir</p>
          </div>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#f3f4f6', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} 
                  itemStyle={{ color: '#111827', fontWeight: 'bold' }} 
                />
                <Bar dataKey="insiden" fill="#34C759" radius={[6, 6, 0, 0]} barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Distribusi Status Laporan</h3>
            <p className="text-xs text-gray-500 font-medium mb-4">Rasio penanganan laporan insiden K3</p>
          </div>
          <div className="flex-1 min-h-0 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={64}
                  outerRadius={94}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Graphics from Statistics.jsx moved to Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Laporan Berdasarkan Jenis</h3>
            <p className="text-xs text-gray-500 font-medium mb-4">Grafik batang kategori insiden yang terekam</p>
          </div>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={11} width={130} />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Rasio Tingkat Keparahan</h3>
            <p className="text-xs text-gray-500 font-medium mb-4">Grafik donat keparahan insiden di area kerja</p>
          </div>
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            {severityData.length === 0 ? (
              <p className="text-gray-400 text-sm">Tidak ada data untuk ditampilkan</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100/60">
        <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/report"
            className="flex items-center p-4 bg-green-50/60 hover:bg-green-100/80 hover:shadow-sm rounded-xl transition-all border border-green-100/80 duration-200"
          >
            <div className="text-3xl mr-4 text-[#34C759]">
              <FaEdit />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Laporkan Insiden</h3>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Buat laporan insiden baru</p>
            </div>
          </Link>

          <Link
            to="/history"
            className="flex items-center p-4 bg-primary-50/60 hover:bg-primary-100/80 hover:shadow-sm rounded-xl transition-all border border-green-200/60 duration-200"
            style={{ borderColor: '#a3e3b7' }}
          >
            <div className="text-3xl mr-4 text-gray-600">
              <FaClipboardList />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Riwayat Laporan</h3>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Lihat semua laporan</p>
            </div>
          </Link>

          <Link
            to="/statistics"
            className="flex items-center p-4 bg-purple-50/60 hover:bg-purple-100/80 hover:shadow-sm rounded-xl transition-all border border-purple-100/80 duration-200"
          >
            <div className="text-3xl mr-4 text-purple-600">
              <FaChartLine />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Daftar Kegiatan</h3>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Lihat postingan kegiatan</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100/60 hover:shadow-lg transition">
          <h2 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">Tentang SafetyKU</h2>
          <p className="text-gray-600 mb-4 text-sm font-medium leading-relaxed">
            SafetyKU adalah sistem pelaporan keselamatan dan kesehatan kerja yang
            dirancang untuk memudahkan pelaporan insiden, monitoring, dan analisis
            data keselamatan kerja.
          </p>
          <p className="text-gray-600 text-sm font-medium leading-relaxed">
            Sistem ini membantu organisasi dalam mengelola dan mencegah insiden
            keselamatan kerja dengan lebih efektif.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100/60 hover:shadow-lg transition">
          <h2 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">K3 Indonesia</h2>
          <p className="text-gray-600 mb-4 text-sm font-medium leading-relaxed">
            Keselamatan dan Kesehatan Kerja (K3) adalah upaya untuk menciptakan
            tempat kerja yang aman, sehat, dan bebas dari pencemaran lingkungan.
          </p>
          <p className="text-gray-600 text-sm font-medium leading-relaxed">
            Dengan menerapkan K3, kita dapat mencegah kecelakaan kerja dan penyakit
            akibat kerja, serta meningkatkan produktivitas.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
