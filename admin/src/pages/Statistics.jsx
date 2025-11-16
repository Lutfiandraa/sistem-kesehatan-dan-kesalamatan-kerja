import { useState, useEffect } from 'react'
import api from '../services/api'

function Statistics() {
  const [stats, setStats] = useState({
    byType: {},
    bySeverity: {},
    byStatus: {},
    monthly: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/incidents')
      const incidents = response.data.data.incidents || []
      
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

      // Monthly data
      const monthly = {}
      incidents.forEach(incident => {
        const date = new Date(incident.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthly[monthKey] = (monthly[monthKey] || 0) + 1
      })

      setStats({ byType, bySeverity, byStatus, monthly: Object.entries(monthly) })
    } catch (error) {
      console.error('Error fetching statistics:', error)
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
    const labels = {
      low: 'Rendah',
      medium: 'Sedang',
      high: 'Tinggi',
      critical: 'Kritis'
    }
    return labels[severity] || severity
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Statistik Laporan</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-600">Memuat data...</div>
      ) : (
        <div className="space-y-6">
          {/* By Type */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Laporan Berdasarkan Jenis</h2>
            <div className="space-y-3">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-gray-700">{getTypeLabel(type)}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: '#34C759',
                          width: `${(count / Math.max(...Object.values(stats.byType))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Severity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Laporan Berdasarkan Tingkat Keparahan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.bySeverity).map(([severity, count]) => (
                <div key={severity} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{getSeverityLabel(severity)}</p>
                  <p className="text-3xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* By Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Laporan Berdasarkan Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{getStatusLabel(status)}</p>
                  <p className="text-3xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          {stats.monthly.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Trend Bulanan</h2>
              <div className="space-y-2">
                {stats.monthly.map(([month, count]) => (
                  <div key={month} className="flex items-center justify-between">
                    <span className="text-gray-700">{month}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-48 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${(count / Math.max(...stats.monthly.map(m => m[1]))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Statistics

