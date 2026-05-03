import { useState, useEffect } from 'react'
import api from '../services/api'
import { FaPlus, FaTrash, FaClipboardList } from 'react-icons/fa'

function Statistics() {
  const [activities, setActivities] = useState([])
  const [loadingActivities, setLoadingActivities] = useState(true)

  // Activities Form
  const [formData, setFormData] = useState({
    title: '',
    category: 'Health',
    description: ''
  })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true)
      const response = await api.get('/public/activities')
      setActivities(response.data.data || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoadingActivities(false)
    }
  }

  const handleCreateActivity = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (!formData.title || !formData.description) {
      setFormError('Harap lengkapi semua kolom!')
      return
    }

    try {
      await api.post('/public/activities', formData)
      setFormSuccess('Kegiatan berhasil ditambahkan!')
      setFormData({ title: '', category: 'Health', description: '' })
      fetchActivities()
    } catch (error) {
      setFormError('Gagal menambahkan kegiatan. Silakan coba lagi.')
    }
  }

  const handleDeleteActivity = async (id) => {
    try {
      await api.delete(`/public/activities/${id}`)
      fetchActivities()
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 select-none animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight select-none">
          Daftar Kegiatan K3
        </h1>
        <p className="text-gray-500 font-medium text-sm md:text-base">
          Pantau semua program K3 dan buat postingan kegiatan baru dengan kategori dropdown Health, Safety, Environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        {/* Create Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl text-[#34C759]"><FaPlus /></span>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">Buat Postingan Kegiatan</h3>
          </div>

          {formError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded text-xs text-red-700 font-semibold">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4 rounded text-xs text-green-700 font-semibold">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleCreateActivity} className="space-y-4">
            <div>
              <label className="block mb-1 text-xs font-bold text-gray-600 uppercase">Judul Kegiatan *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Safety Talk Mingguan"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-bold text-gray-600 uppercase">Kategori K3 *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition bg-gray-50 focus:bg-white"
              >
                <option value="Health">Health</option>
                <option value="Safety">Safety</option>
                <option value="Enviroment">Enviroment</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-bold text-gray-600 uppercase">Deskripsi Kegiatan *</label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detail kegiatan..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition bg-gray-50 focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#34C759] hover:bg-[#2fb14e] text-white rounded-xl text-sm font-black transition duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              Kirim Postingan
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-md flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl text-[#34C759]"><FaClipboardList /></span>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">Daftar Kegiatan Terbaru</h3>
            </div>

            {loadingActivities ? (
              <div className="text-center py-12 text-gray-500 font-medium text-sm animate-pulse">Memuat kegiatan...</div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-medium text-sm">Belum ada postingan kegiatan</div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {activities.map((act) => (
                  <div key={act.id} className="p-4 rounded-xl border border-gray-100/80 bg-gray-50/50 hover:shadow-sm transition flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-emerald-100 text-emerald-800 shadow-sm">
                          {act.category}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">
                          {new Date(act.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-gray-800 tracking-tight leading-tight mb-1">{act.title}</h4>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-lg">{act.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      className="text-red-400 hover:text-red-600 p-2 text-base transition rounded-lg hover:bg-red-50"
                      title="Hapus Kegiatan"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
