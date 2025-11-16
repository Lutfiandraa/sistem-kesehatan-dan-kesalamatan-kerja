import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaChevronDown, FaExclamationCircle } from 'react-icons/fa'
import api from '../../services/api'

function RiwayatPelaporan() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data laporan dari backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/public/reports')
        setReports(response.data || [])
      } catch (error) {
        console.error('Error fetching reports:', error)
        setReports([])
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // State untuk menyimpan status setiap report (default: belum_dicek)
  const [reportStatuses, setReportStatuses] = useState({})

  // Sync reportStatuses dengan reports saat reports berubah
  useEffect(() => {
    const statusMap = {}
    reports.forEach(report => {
      if (!(report.id in reportStatuses)) {
        statusMap[report.id] = 'belum_dicek'
      }
    })
    if (Object.keys(statusMap).length > 0) {
      setReportStatuses(prev => ({ ...prev, ...statusMap }))
    }
  }, [reports])

  // State untuk dropdown yang terbuka
  const [openDropdown, setOpenDropdown] = useState(null)
  
  // State untuk mode select (untuk delete multiple)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedReports, setSelectedReports] = useState([])

  // State untuk kategori dropdown
  const [kategoriDropdown, setKategoriDropdown] = useState(false)
  const [selectedKategori, setSelectedKategori] = useState(null) // 'Terberat' atau 'Teringan'

  const filters = ['Semua', 'Kategori', 'Status']

  // Opsi status dropdown
  const statusOptions = [
    { value: 'belum_dicek', label: 'Belum di Cek', color: '#9E9E9E' },
    { value: 'belum_ditangani', label: 'Belum di Tangani', color: '#F44336' },
    { value: 'dalam_penangan', label: 'Dalam Penangan', color: '#FFC107' },
    { value: 'aman', label: 'Aman!', color: '#34C759' }
  ]

  const handleStatusChange = async (reportId, status) => {
    try {
      // Update status via API
      await api.put(`/public/reports/${reportId}`, { status })
      
      // Update status di state
      setReportStatuses(prev => ({
        ...prev,
        [reportId]: status
      }))
      
      // Update status di reports juga
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? { ...report, status } : report
        )
      )
      
      setOpenDropdown(null)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Gagal mengupdate status')
    }
  }

  // Fungsi untuk toggle select mode
  const toggleSelectMode = () => {
    setSelectMode(!selectMode)
    if (selectMode) {
      setSelectedReports([])
    }
    setOpenDropdown(null)
  }

  // Fungsi untuk toggle select report
  const toggleSelectReport = (reportId) => {
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId)
      } else {
        return [...prev, reportId]
      }
    })
  }

  // Fungsi untuk delete selected reports
  const handleDeleteSelected = async () => {
    if (selectedReports.length === 0) {
      alert('Pilih laporan yang ingin dihapus')
      return
    }
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedReports.length} laporan yang dipilih?`)) {
      try {
        // Hapus reports via API
        await Promise.all(
          selectedReports.map(id => api.delete(`/public/reports/${id}`))
        )
        
        // Hapus reports yang dipilih dari state
        setReports(prevReports => prevReports.filter(report => !selectedReports.includes(report.id)))
        
        // Hapus status dari reportStatuses
        setReportStatuses(prevStatuses => {
          const newStatuses = { ...prevStatuses }
          selectedReports.forEach(id => {
            delete newStatuses[id]
          })
          return newStatuses
        })
        
        // Reset selection
        setSelectedReports([])
        setSelectMode(false)
        setOpenDropdown(null)
        
        alert(`${selectedReports.length} laporan berhasil dihapus`)
      } catch (error) {
        console.error('Error deleting reports:', error)
        alert('Gagal menghapus laporan')
      }
    }
  }

  // Fungsi untuk check jika report mengandung keyword 'Berat'
  const isBeratReport = (report) => {
    const beratKeywords = ['berat', 'Berat', 'BERAT']
    return beratKeywords.some(keyword => 
      report.title?.includes(keyword) || 
      report.description?.includes(keyword) ||
      report.severity === 'berat'
    )
  }

  // Fungsi untuk mendapatkan nilai severity untuk sorting
  const getSeverityValue = (report) => {
    // Mapping severity ke nilai numerik untuk sorting
    // ringan = 1, sedang = 2, berat = 3
    const severityMap = {
      'ringan': 1,
      'sedang': 2,
      'berat': 3
    }
    
    // Jika ada severity langsung, gunakan itu
    if (report.severity && severityMap[report.severity.toLowerCase()]) {
      return severityMap[report.severity.toLowerCase()]
    }
    
    // Jika tidak ada severity, cek dari title atau description
    const beratKeywords = ['berat', 'Berat', 'BERAT']
    const ringanKeywords = ['ringan', 'Ringan', 'RINGAN']
    
    if (beratKeywords.some(keyword => 
      report.title?.includes(keyword) || report.description?.includes(keyword)
    )) {
      return 3
    }
    
    if (ringanKeywords.some(keyword => 
      report.title?.includes(keyword) || report.description?.includes(keyword)
    )) {
      return 1
    }
    
    // Default ke sedang jika tidak ditemukan
    return 2
  }

  const getFilteredReports = () => {
    let filtered = [...reports] // Copy array untuk sorting

    if (activeFilter === 'Status') {
      // Filter berdasarkan status yang dipilih (kecuali "belum_dicek")
      filtered = reports.filter(report => {
        const status = reportStatuses[report.id]
        return status !== 'belum_dicek'
      })
    } else if (activeFilter === 'Kategori') {
      // Jika kategori dropdown dipilih, sort berdasarkan severity
      if (selectedKategori === 'Teringan') {
        // Sort dari ringan ke berat (ascending)
        filtered.sort((a, b) => {
          return getSeverityValue(a) - getSeverityValue(b)
        })
      } else if (selectedKategori === 'Terberat') {
        // Sort dari berat ke ringan (descending)
        filtered.sort((a, b) => {
          return getSeverityValue(b) - getSeverityValue(a)
        })
      }
      // Jika tidak ada kategori yang dipilih, tampilkan semua tanpa sorting khusus
    }

    return filtered
  }

  const filteredReports = getFilteredReports()

  const getStatusInfo = (reportId) => {
    const status = reportStatuses[reportId] || 'belum_dicek'
    return statusOptions.find(opt => opt.value === status) || statusOptions[0]
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      {/* Header */}
      <div className="shadow-md" style={{ backgroundColor: '#34C759' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">Riwayat Pelaporan</h1>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3 items-center">
            {filters.map((filter) => (
              <div key={filter} className="relative">
                <button
                  onClick={() => {
                    setActiveFilter(filter)
                    if (filter === 'Kategori') {
                      setKategoriDropdown(!kategoriDropdown)
                    } else {
                      setKategoriDropdown(false)
                      setSelectedKategori(null)
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeFilter === filter
                      ? 'bg-primary-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={activeFilter === filter ? { backgroundColor: 'rgba(52, 199, 89, 0.2)' } : {}}
                >
                  {filter}
                  {filter === 'Kategori' && (
                    <FaChevronDown 
                      className={`w-3 h-3 transition-transform duration-200 ${
                        kategoriDropdown ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>
                
                {/* Dropdown untuk Kategori */}
                {filter === 'Kategori' && kategoriDropdown && activeFilter === 'Kategori' && (
                  <>
                    <div 
                      className="fixed inset-0" 
                      onClick={() => setKategoriDropdown(false)}
                      style={{ 
                        backgroundColor: 'transparent',
                        zIndex: 40
                      }}
                    ></div>
                    <div 
                      className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 animate-dropdown overflow-hidden z-50"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        animation: 'dropdownSlide 0.2s ease-out',
                        zIndex: 50
                      }}
                    >
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedKategori('Terberat')
                            setKategoriDropdown(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 ${
                            selectedKategori === 'Terberat'
                              ? 'bg-gray-100 font-semibold text-primary-600'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                          style={selectedKategori === 'Terberat' ? { color: '#34C759' } : {}}
                        >
                          Terberat
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedKategori('Teringan')
                            setKategoriDropdown(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 ${
                            selectedKategori === 'Teringan'
                              ? 'bg-gray-100 font-semibold text-primary-600'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                          style={selectedKategori === 'Teringan' ? { color: '#34C759' } : {}}
                        >
                          Teringan
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ isolation: 'isolate' }}>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat data...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada laporan ditemukan.</p>
          </div>
        ) : (
        <div className="space-y-4">
          {filteredReports.map((report, index) => {
            const isDropdownOpen = openDropdown === report.id
            // Card dengan dropdown terbuka mendapat z-index sangat tinggi untuk muncul di atas semua card
            const cardZIndex = isDropdownOpen ? 50 : 1 + index
            
            return (
              <div
                key={report.id}
                className={`bg-white rounded-xl shadow-md relative ${
                  index === 0 ? 'animate-pop-in' : 
                  index === 1 ? 'animate-pop-in-delay' : 
                  'animate-pop-in-delay-2'
                }`}
                style={{
                  zIndex: cardZIndex,
                  position: 'relative',
                  isolation: isDropdownOpen ? 'isolate' : 'auto'
                }}
              >
                {/* Notification icon for "Berat" reports */}
                {isBeratReport(report) && (
                  <div 
                    className="absolute top-3 right-16 z-10"
                    style={{ zIndex: 10 }}
                    title="Laporan Berat - Perlu Perhatian Khusus"
                  >
                    <FaExclamationCircle 
                      className="text-red-500" 
                      style={{ 
                        fontSize: '20px',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                      }} 
                    />
                  </div>
                )}
                
                {/* Image Section - hanya tampil jika ada gambar */}
                {report.image && (
                  <div className="w-full h-48 overflow-hidden rounded-t-xl bg-gray-100">
                    <img
                      src={report.image}
                      alt={report.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Jika gambar gagal dimuat, sembunyikan container
                        e.target.style.display = 'none'
                        e.target.parentElement.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                <div className="p-4 pl-5 relative">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      {selectMode && (
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(report.id)}
                          onChange={() => toggleSelectReport(report.id)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          style={{ accentColor: '#34C759' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <h3 className="text-base font-bold text-gray-900">{report.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{report.date}</p>
                  <p className="text-sm text-gray-700 mb-4">{report.description}</p>
                  
                  <div className="flex justify-end">
                    <div className="relative" style={{ zIndex: 100 }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdown(openDropdown === report.id ? null : report.id)
                        }}
                        className="px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 text-white shadow-sm relative"
                        style={{ backgroundColor: getStatusInfo(report.id).color }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        {getStatusInfo(report.id).label}
                        <FaChevronDown 
                          className={`w-3 h-3 transition-transform duration-200 ${
                            openDropdown === report.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0" 
                            onClick={() => setOpenDropdown(null)}
                            style={{ 
                              backgroundColor: 'transparent',
                              zIndex: 49
                            }}
                          ></div>
                          <div 
                            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 animate-dropdown overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              animation: 'dropdownSlide 0.2s ease-out',
                              zIndex: 101,
                              position: 'absolute'
                            }}
                          >
                            <div className="py-1">
                              {statusOptions.map((option, optIndex) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleStatusChange(report.id, option.value)
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 ${
                                    reportStatuses[report.id] === option.value
                                      ? 'bg-gray-100 font-semibold'
                                      : 'hover:bg-gray-50'
                                  }`}
                                  style={{
                                    color: reportStatuses[report.id] === option.value ? option.color : '#374151',
                                    animationDelay: `${optIndex * 0.02}s`
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="w-3 h-3 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: option.color }}
                                    ></div>
                                    <span>{option.label}</span>
                                  </div>
                                </button>
                              ))}
                              
                              {/* Divider */}
                              <div className="border-t border-gray-200 my-1"></div>
                              
                              {/* Select & Delete Buttons */}
                              <div className="px-2 py-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleSelectMode()
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm transition-all duration-150 hover:bg-gray-50 text-gray-700"
                                >
                                  {selectMode ? 'Batal Pilih' : 'Pilih untuk Hapus'}
                                </button>
                                {selectMode && selectedReports.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteSelected()
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm transition-all duration-150 hover:bg-red-50 text-red-600 font-medium"
                                  >
                                    Hapus ({selectedReports.length})
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        )}
      </div>
    </div>
  )
}

export default RiwayatPelaporan

