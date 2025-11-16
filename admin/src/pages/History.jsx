import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { FaMapMarkerAlt, FaCalendar } from 'react-icons/fa'

function History() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    severity: ''
  })

  useEffect(() => {
    fetchIncidents()
  }, [filters])

  const fetchIncidents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.severity) params.append('severity', filters.severity)
      
      const response = await api.get(`/incidents?${params.toString()}`)
      setIncidents(response.data.data.incidents)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      under_review: '#2196f3',
      resolved: '#4caf50',
      closed: '#9e9e9e'
    }
    return colors[status] || '#666'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Menunggu',
      under_review: 'Ditinjau',
      resolved: 'Selesai',
      closed: 'Ditutup'
    }
    return labels[status] || status
  }

  const getSeverityColor = (severity) => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336',
      critical: '#d32f2f'
    }
    return colors[severity] || '#666'
  }

  const getSeverityLabel = (severity) => {
    const labels = {
      low: 'Rendah',
      medium: 'Sedang',
      high: 'Tinggi',
      critical: 'Kritis'
    }
    return labels[severity] || severity
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Riwayat Laporan</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border-2 border-gray-200 rounded-xl bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
        >
          <option value="">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="under_review">Ditinjau</option>
          <option value="resolved">Selesai</option>
          <option value="closed">Ditutup</option>
        </select>

        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          className="px-4 py-2 border-2 border-gray-200 rounded-xl bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
        >
          <option value="">Semua Tingkat</option>
          <option value="low">Rendah</option>
          <option value="medium">Sedang</option>
          <option value="high">Tinggi</option>
          <option value="critical">Kritis</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-600">Memuat data...</div>
      ) : incidents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-6">Belum ada laporan</p>
          <button
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
            onClick={() => navigate('/report')}
          >
            Buat Laporan Baru
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{incident.title}</h3>
                  <p className="text-xs text-gray-500">{incident.report_number}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: getStatusColor(incident.status) }}
                  >
                    {getStatusLabel(incident.status)}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: getSeverityColor(incident.severity) }}
                  >
                    {getSeverityLabel(incident.severity)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{incident.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt /> {incident.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendar /> {formatDate(incident.incident_date)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History

