import { useState, useEffect } from 'react'
import { FaTimes, FaBook, FaFileAlt, FaPlus, FaTrash } from 'react-icons/fa'
import api from '../../services/api'

function Kegiatan() {
  const [selectedMateri, setSelectedMateri] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMateri, setNewMateri] = useState({
    title: '',
    caption: '',
    content: '',
    category: 'Safety'
  })

  // State untuk select mode dan selected materials
  const [selectMode, setSelectMode] = useState(false)
  const [selectedMaterials, setSelectedMaterials] = useState([])

  // State untuk materi safety talks - fetch dari backend
  const [safetyTalksMaterials, setSafetyTalksMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data materi dari backend
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await api.get('/public/materials')
        setSafetyTalksMaterials(response.data || [])
      } catch (error) {
        console.error('Error fetching materials:', error)
        setSafetyTalksMaterials([])
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [])


  // Fungsi untuk toggle select mode
  const toggleSelectMode = () => {
    setSelectMode(!selectMode)
    if (selectMode) {
      setSelectedMaterials([])
    }
  }

  // Fungsi untuk toggle select material
  const toggleSelectMaterial = (materialId) => {
    setSelectedMaterials(prev => {
      if (prev.includes(materialId)) {
        return prev.filter(id => id !== materialId)
      } else {
        return [...prev, materialId]
      }
    })
  }

  // Fungsi untuk delete selected materials
  const handleDeleteSelected = async () => {
    if (selectedMaterials.length === 0) {
      alert('Pilih materi yang ingin dihapus')
      return
    }
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedMaterials.length} materi yang dipilih?`)) {
      try {
        // Hapus materials via API
        await Promise.all(
          selectedMaterials.map(id => api.delete(`/public/materials/${id}`))
        )
        
        // Hapus materials yang dipilih dari state
        setSafetyTalksMaterials(prevMaterials => 
          prevMaterials.filter(material => !selectedMaterials.includes(material.id))
        )
        
        // Reset selection
        setSelectedMaterials([])
        setSelectMode(false)
        
        alert(`${selectedMaterials.length} materi berhasil dihapus`)
      } catch (error) {
        console.error('Error deleting materials:', error)
        alert('Gagal menghapus materi')
      }
    }
  }

  // Fungsi untuk cancel select mode
  const handleCancelSelect = () => {
    setSelectMode(false)
    setSelectedMaterials([])
  }

  const handleAddMateri = async (e) => {
    e.preventDefault()
    
    // Validasi
    if (!newMateri.title.trim()) {
      alert('Judul Materi harus diisi')
      return
    }
    if (!newMateri.caption.trim()) {
      alert('Caption harus diisi')
      return
    }
    if (!newMateri.content.trim()) {
      alert('Isi Materi harus diisi')
      return
    }

    try {
      // Kirim data ke backend
      const response = await api.post('/public/materials', {
        title: newMateri.title,
        category: newMateri.category,
        description: newMateri.caption,
        content: newMateri.content
      })
      
      // Ambil data material dari response
      // Backend mengembalikan { success: true, message: '...', data: {...} }
      const newMaterial = response.data?.data || response.data
      
      if (!newMaterial || !newMaterial.id) {
        throw new Error('Invalid response from server')
      }
      
      // Tambahkan ke state lokal
      setSafetyTalksMaterials(prev => [newMaterial, ...prev])
      
      // Reset form
      setNewMateri({ title: '', caption: '', content: '', category: 'Safety' })
      setShowAddModal(false)
      
      alert('Materi berhasil ditambahkan!')
    } catch (error) {
      console.error('Error adding materi:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Gagal menambahkan materi'
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setNewMateri({ title: '', caption: '', content: '', category: 'Safety' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kegiatan</h1>
          <div className="flex items-center gap-3">
            {!selectMode ? (
              <button
                onClick={toggleSelectMode}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium transition-colors hover:bg-gray-50"
              >
                <span>Select</span>
              </button>
            ) : (
              <>
                {selectedMaterials.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                    style={{ backgroundColor: '#F44336' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D32F2F'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F44336'}
                  >
                    <FaTrash />
                    <span>Hapus ({selectedMaterials.length})</span>
                  </button>
                )}
                <button
                  onClick={handleCancelSelect}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium transition-colors hover:bg-gray-50"
                >
                  <span>Cancel</span>
                </button>
              </>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors animate-pop-in"
              style={{ backgroundColor: '#34C759' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a9f47'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#34C759'}
            >
              <FaPlus />
              <span>Tambahkan Materi</span>
            </button>
          </div>
        </div>

        <div>
          <p className="text-gray-600 mb-4">
            Berikut adalah kumpulan materi safety talks yang dapat Anda pergunakan di tempat bekerja. 
            Safety talks atau toolbox meeting adalah salah satu cara mudah untuk mengingatkan pekerja 
            bahwa kesehatan dan keselamatan penting dalam pekerjaan.
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari materi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  '--tw-ring-color': '#34C759'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#34C759'
                  e.target.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('Semua')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'Semua'
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedCategory === 'Semua' ? { backgroundColor: '#34C759' } : {}}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedCategory('Safety')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'Safety'
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedCategory === 'Safety' ? { backgroundColor: '#34C759' } : {}}
              >
                Safety
              </button>
              <button
                onClick={() => setSelectedCategory('Kesehatan')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'Kesehatan'
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedCategory === 'Kesehatan' ? { backgroundColor: '#34C759' } : {}}
              >
                Kesehatan
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat data...</p>
          </div>
        ) : (
        <div className="space-y-3">
          {safetyTalksMaterials
            .filter(materi => {
              if (!materi || !materi.title || !materi.description) return false
              const matchesSearch = materi.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   materi.description.toLowerCase().includes(searchQuery.toLowerCase())
              const matchesCategory = selectedCategory === 'Semua' || 
                (selectedCategory === 'Kesehatan' && (materi.category === 'Kesehatan' || materi.category === 'Health')) ||
                (selectedCategory === 'Safety' && materi.category === 'Safety')
              return matchesSearch && matchesCategory
            })
            .map((materi, index) => {
              if (!materi || !materi.id) return null
              return (
              <div
                key={materi.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5 ${
                  selectMode ? '' : 'cursor-pointer'
                } ${
                  index % 3 === 0 ? 'animate-pop-in' : 
                  index % 3 === 1 ? 'animate-pop-in-delay' : 
                  'animate-pop-in-delay-2'
                }`}
                onClick={() => {
                  if (!selectMode) {
                    setSelectedMateri(materi)
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      {selectMode && (
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(materi.id)}
                          onChange={() => toggleSelectMaterial(materi.id)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          style={{ accentColor: '#34C759' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <FaBook className="text-primary-500 flex-shrink-0" style={{ color: '#34C759' }} />
                      <h3 className="text-lg font-semibold text-gray-900">{materi.title}</h3>
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: materi.category === 'Safety' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: materi.category === 'Safety' ? '#34C759' : '#3B82F6'
                        }}
                      >
                        {materi.category === 'Health' ? 'Kesehatan' : materi.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm ml-8">{materi.description}</p>
                  </div>
                  <FaFileAlt className="text-gray-400 ml-4 flex-shrink-0" />
                </div>
              </div>
              )
            })}
          {safetyTalksMaterials.filter(materi => {
            if (!materi || !materi.title || !materi.description) return false
            const matchesSearch = materi.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 materi.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'Semua' || 
              (selectedCategory === 'Kesehatan' && (materi.category === 'Kesehatan' || materi.category === 'Health')) ||
              (selectedCategory === 'Safety' && materi.category === 'Safety')
            return matchesSearch && matchesCategory
          }).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada materi yang ditemukan.</p>
            </div>
          )}
        </div>
        )}

        {/* Modal for materi detail */}
        {selectedMateri && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMateri(null)}
          >
            <div 
              className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FaBook className="text-primary-500" style={{ color: '#34C759' }} />
                      <h2 className="text-2xl font-bold text-gray-900">{selectedMateri.title}</h2>
                      <span 
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{
                          backgroundColor: selectedMateri.category === 'Safety' ? 'rgba(52, 199, 89, 0.1)' : selectedMateri.category === 'Kesehatan' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: selectedMateri.category === 'Safety' ? '#34C759' : selectedMateri.category === 'Kesehatan' ? '#3B82F6' : '#3B82F6'
                        }}
                      >
                        {selectedMateri.category === 'Health' ? 'Kesehatan' : selectedMateri.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMateri(null)}
                    className="text-gray-500 hover:text-gray-700 ml-4"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600 mb-4">{selectedMateri.description}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Isi Materi</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{selectedMateri.content}</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Catatan:</strong> Materi ini dapat disesuaikan dengan kondisi bahaya dan risiko di tempat Anda bekerja. 
                    Safety talks ini baik jika disampaikan setiap pagi sebelum memulai pekerjaan atau setiap memulai proyek baru.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Add Materi */}
        {showAddModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseAddModal}
          >
            <div 
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Tambahkan Materi Baru</h2>
                  <button
                    onClick={handleCloseAddModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleAddMateri} className="space-y-6">
                  {/* Judul Materi */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Materi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newMateri.title}
                      onChange={(e) => setNewMateri({ ...newMateri, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                      placeholder="Masukkan judul materi"
                      required
                      onFocus={(e) => {
                        e.target.style.borderColor = '#34C759'
                        e.target.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#D1D5DB'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>

                  {/* Caption */}
                  <div>
                    <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                      Caption <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="caption"
                      name="caption"
                      value={newMateri.caption}
                      onChange={(e) => setNewMateri({ ...newMateri, caption: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none"
                      placeholder="Masukkan caption/deskripsi materi"
                      required
                      onFocus={(e) => {
                        e.target.style.borderColor = '#34C759'
                        e.target.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#D1D5DB'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>

                  {/* Isi Materi */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Isi Materi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={newMateri.content}
                      onChange={(e) => setNewMateri({ ...newMateri, content: e.target.value })}
                      rows="6"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none"
                      placeholder="Masukkan isi materi"
                      required
                      onFocus={(e) => {
                        e.target.style.borderColor = '#34C759'
                        e.target.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#D1D5DB'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>

                  {/* Dropdown Kategori */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={newMateri.category}
                      onChange={(e) => setNewMateri({ ...newMateri, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                      required
                      onFocus={(e) => {
                        e.target.style.borderColor = '#34C759'
                        e.target.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#D1D5DB'
                        e.target.style.boxShadow = 'none'
                      }}
                    >
                      <option value="Safety">Safety</option>
                      <option value="Kesehatan">Kesehatan</option>
                    </select>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseAddModal}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg text-white font-medium transition-colors"
                      style={{ backgroundColor: '#34C759' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a9f47'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#34C759'}
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Kegiatan

