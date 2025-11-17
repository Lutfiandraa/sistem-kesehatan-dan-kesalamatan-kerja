import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function ReportIncident() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    incident_type: 'near_miss',
    title: '',
    description: '',
    location: '',
    incident_date: new Date().toISOString().slice(0, 16),
    severity: 'low'
  })

  const incidentTypes = [
    { value: 'near_miss', label: 'Near Miss' },
    { value: 'injury', label: 'Cedera' },
    { value: 'property_damage', label: 'Kerusakan Properti' },
    { value: 'unsafe_condition', label: 'Kondisi Tidak Aman' },
    { value: 'unsafe_behavior', label: 'Perilaku Tidak Aman' },
    { value: 'other', label: 'Lainnya' }
  ]

  const severityLevels = [
    { value: 'low', label: 'Rendah', color: '#4caf50' },
    { value: 'medium', label: 'Sedang', color: '#ff9800' },
    { value: 'high', label: 'Tinggi', color: '#f44336' },
    { value: 'critical', label: 'Kritis', color: '#d32f2f' }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/incidents', formData)
      navigate('/history')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat laporan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Laporkan Insiden</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="incident_type" className="block mb-2 text-sm font-semibold text-gray-700">
              Jenis Insiden *
            </label>
            <select
              id="incident_type"
              name="incident_type"
              value={formData.incident_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
            >
              {incidentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 text-sm font-semibold text-gray-700">
              Judul Laporan *
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masukkan judul laporan"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-700">
              Deskripsi *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan insiden secara detail"
              rows="5"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all resize-y"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="location" className="block mb-2 text-sm font-semibold text-gray-700">
              Lokasi *
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Masukkan lokasi insiden"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="incident_date" className="block mb-2 text-sm font-semibold text-gray-700">
              Tanggal & Waktu Insiden *
            </label>
            <input
              id="incident_date"
              type="datetime-local"
              name="incident_date"
              value={formData.incident_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700" id="severity-label">
              Tingkat Keparahan *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {severityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  className={`px-4 py-3 border-2 rounded-xl font-medium text-sm transition-all ${
                    formData.severity === level.value
                      ? 'text-white'
                      : 'bg-white text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, severity: level.value })}
                  style={{
                    backgroundColor: formData.severity === level.value ? level.color : 'white',
                    borderColor: formData.severity === level.value ? level.color : '#e5e7eb'
                  }}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              onClick={() => navigate('/dashboard')}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>
    </div>
  )
}

export default ReportIncident

