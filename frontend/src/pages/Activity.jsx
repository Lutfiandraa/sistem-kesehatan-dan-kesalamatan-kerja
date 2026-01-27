import { useState, useEffect, useRef } from 'react'
import { FaTimes, FaBook, FaChevronDown } from 'react-icons/fa'
import api from '../services/api'

// Helper function untuk dummy data
const getDummyMaterials = () => [
  {
    id: 'dummy-1',
    title: 'Pentingnya Alat Pelindung Diri (APD) di Tempat Kerja',
    description: 'Alat Pelindung Diri (APD) merupakan perlengkapan wajib yang harus digunakan oleh pekerja untuk melindungi diri dari bahaya di tempat kerja. Setiap pekerja harus memahami jenis APD yang sesuai dengan pekerjaannya.',
    category: 'Safety',
    content: 'Alat Pelindung Diri (APD) adalah perlengkapan yang wajib digunakan oleh pekerja untuk melindungi diri dari bahaya di tempat kerja. APD meliputi helm keselamatan, kacamata pelindung, sarung tangan, sepatu safety, dan masker. Penggunaan APD yang tepat dapat mencegah kecelakaan kerja dan cedera serius.',
    image: '/APD.png'
  },
  {
    id: 'dummy-2',
    title: 'Prosedur Evakuasi Darurat di Tempat Kerja',
    description: 'Setiap pekerja harus memahami prosedur evakuasi darurat di tempat kerja. Prosedur ini mencakup rute evakuasi, titik kumpul, dan langkah-langkah yang harus dilakukan saat terjadi keadaan darurat.',
    category: 'Safety',
    content: 'Prosedur evakuasi darurat adalah langkah-langkah yang harus dilakukan saat terjadi keadaan darurat seperti kebakaran, gempa bumi, atau bencana lainnya. Setiap pekerja harus mengetahui rute evakuasi terdekat, titik kumpul yang aman, dan cara menggunakan alat pemadam kebakaran.',
    image: '/evakuasi.png'
  },
  {
    id: 'dummy-3',
    title: 'Kesehatan Mental di Tempat Kerja',
    description: 'Kesehatan mental sama pentingnya dengan kesehatan fisik di tempat kerja. Stres kerja, beban kerja berlebihan, dan lingkungan kerja yang tidak sehat dapat mempengaruhi kesehatan mental pekerja.',
    category: 'Kesehatan',
    content: 'Kesehatan mental di tempat kerja adalah kondisi dimana pekerja merasa nyaman, produktif, dan dapat bekerja dengan optimal. Perusahaan harus menyediakan lingkungan kerja yang mendukung kesehatan mental, termasuk program konseling, work-life balance, dan dukungan dari rekan kerja dan atasan.',
    image: '/kesehatan.png'
  },
  {
    id: 'dummy-4',
    title: 'Pencegahan Kecelakaan Kerja dengan Metode 5S',
    description: 'Metode 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke) adalah sistem manajemen tempat kerja yang dapat membantu mencegah kecelakaan kerja dengan menciptakan lingkungan kerja yang rapi, bersih, dan terorganisir.',
    category: 'Safety',
    content: 'Metode 5S adalah sistem manajemen tempat kerja yang terdiri dari 5 langkah: Seiri (Sorting), Seiton (Set in Order), Seiso (Shine), Seiketsu (Standardize), dan Shitsuke (Sustain). Penerapan metode 5S dapat mengurangi risiko kecelakaan kerja, meningkatkan produktivitas, dan menciptakan lingkungan kerja yang lebih baik.',
    image: '/manfaat5s.png'
  },
  {
    id: 'dummy-5',
    title: 'Pertolongan Pertama pada Kecelakaan (P3K)',
    description: 'Pengetahuan tentang Pertolongan Pertama pada Kecelakaan (P3K) sangat penting di tempat kerja. Setiap pekerja harus memahami dasar-dasar P3K untuk dapat memberikan pertolongan pertama saat terjadi kecelakaan.',
    category: 'Kesehatan',
    content: 'Pertolongan Pertama pada Kecelakaan (P3K) adalah tindakan pertama yang diberikan kepada korban kecelakaan sebelum mendapatkan perawatan medis profesional. Pengetahuan tentang P3K meliputi penanganan luka, patah tulang, luka bakar, dan kondisi darurat lainnya. Setiap tempat kerja harus memiliki kotak P3K yang lengkap dan pekerja yang terlatih.',
    image: '/p3k.png'
  },
  {
    id: 'dummy-6',
    title: 'Keselamatan dalam Bekerja di Ketinggian',
    description: 'Bekerja di ketinggian memiliki risiko yang tinggi. Pekerja harus menggunakan peralatan keselamatan yang tepat, memahami prosedur kerja yang aman, dan selalu waspada terhadap bahaya yang mungkin terjadi.',
    category: 'Safety',
    content: 'Bekerja di ketinggian memerlukan perhatian khusus terhadap keselamatan. Pekerja harus menggunakan harness, tali pengaman, dan peralatan keselamatan lainnya. Selain itu, pekerja harus memahami prosedur kerja yang aman, melakukan inspeksi peralatan sebelum digunakan, dan selalu waspada terhadap kondisi cuaca dan lingkungan kerja.',
    image: '/scaffolder.png'
  }
]

function Activity() {
  const [selectedMateri, setSelectedMateri] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // State untuk materi safety talks - inisialisasi dengan dummy data
  const [safetyTalksMaterials, setSafetyTalksMaterials] = useState(getDummyMaterials())

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch data materi dari backend (opsional, jika backend tersedia)
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await api.get('/public/materials')
        const materials = response.data || []
        
        // Jika data dari API ada, gunakan data API, jika kurang dari 6 tambahkan dummy
        if (materials.length > 0) {
          if (materials.length < 6) {
            const dummyMaterials = getDummyMaterials()
            const combinedMaterials = [...materials, ...dummyMaterials.slice(0, 6 - materials.length)]
            setSafetyTalksMaterials(combinedMaterials)
          } else {
            setSafetyTalksMaterials(materials)
          }
        }
        // Jika tidak ada data dari API, tetap gunakan dummy data yang sudah diinisialisasi
      } catch (error) {
        // Jika error, tetap gunakan dummy data yang sudah diinisialisasi
        // Tidak perlu setState lagi karena sudah diinisialisasi dengan dummy data
      }
    }

    fetchMaterials()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const categories = [
    { value: 'Semua', label: 'Semua' },
    { value: 'Safety', label: 'Safety' },
    { value: 'Kesehatan', label: 'Kesehatan' }
  ]

  const filteredMaterials = safetyTalksMaterials.filter(materi => {
    if (!materi || !materi.title || !materi.description) return false
    const matchesSearch = materi.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         materi.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Semua' || 
      (selectedCategory === 'Kesehatan' && (materi.category === 'Kesehatan' || materi.category === 'Health')) ||
      (selectedCategory === 'Safety' && materi.category === 'Safety')
    return matchesSearch && matchesCategory
  })

  // Helper function untuk truncate text
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#1e1e1e' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#f5f5f5' }}>Daftar Artikel</h1>
          <p style={{ color: '#b0b0b0' }}>
            Berikut adalah kumpulan materi safety talks yang dapat Anda pergunakan di tempat bekerja.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari materi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{ 
                  borderColor: '#404040',
                  backgroundColor: '#2d2d2d',
                  color: '#f5f5f5',
                  '--tw-ring-color': '#34C759'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#34C759'
                  e.target.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#404040'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 min-w-[150px] shadow-sm hover:shadow-md`}
                style={
                  isDropdownOpen
                    ? {
                        borderColor: '#34C759',
                        backgroundColor: 'rgba(52, 199, 89, 0.15)',
                        color: '#f5f5f5',
                        boxShadow: '0 0 0 3px rgba(52, 199, 89, 0.1)'
                      }
                    : {
                        borderColor: '#404040',
                        backgroundColor: '#2d2d2d',
                        color: '#f5f5f5'
                      }
                }
              >
                <span className="font-medium" style={{ color: '#f5f5f5' }}>{selectedCategory}</span>
                <FaChevronDown 
                  className={`text-gray-500 transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-green-600' : ''}`}
                  size={12}
                />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm animate-dropdown"
                style={{ 
                  backgroundColor: '#2d2d2d',
                  border: '1px solid #404040'
                }}>
                  <div className="py-1">
                    {categories.map((category, index) => (
                      <button
                        key={category.value}
                        onClick={() => {
                          setSelectedCategory(category.value)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-150 ${index === 0 ? 'rounded-t-lg' : ''} ${index === categories.length - 1 ? 'rounded-b-lg' : ''}`}
                        style={
                          selectedCategory === category.value
                            ? {
                                background: 'linear-gradient(135deg, #34C759 0%, #2a9f47 100%)',
                                color: '#ffffff',
                                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                              }
                            : {
                                color: '#e5e5e5'
                              }
                        }
                        onMouseEnter={(e) => {
                          if (selectedCategory !== category.value) {
                            e.currentTarget.style.backgroundColor = '#3a3a3a'
                            e.currentTarget.style.color = '#34C759'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCategory !== category.value) {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = '#e5e5e5'
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.label}</span>
                          {selectedCategory === category.value && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((materi) => {
            if (!materi || !materi.id) return null
            return (
              <div
                key={materi.id}
                className="rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                style={{ 
                  backgroundColor: '#2d2d2d',
                  border: '1px solid #404040'
                }}
                onClick={() => setSelectedMateri(materi)}
              >
                {/* Image Box */}
                {materi.image && (
                  <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={materi.image} 
                      alt={materi.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                    <span 
                      className="px-3 py-1 text-xs font-medium rounded-full inline-block"
                      style={{
                        backgroundColor: materi.category === 'Safety' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: materi.category === 'Safety' ? '#34C759' : '#3B82F6'
                      }}
                    >
                      {materi.category === 'Health' ? 'Kesehatan' : materi.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 flex-shrink-0" style={{ color: '#f5f5f5' }}>
                    {materi.title}
                  </h3>
                  
                  <p className="text-sm mb-4 line-clamp-3 flex-grow" style={{ color: '#b0b0b0' }}>
                    {truncateText(materi.description)}
                  </p>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedMateri(materi)
                    }}
                    className="text-sm font-medium transition-colors mt-auto"
                    style={{ color: '#34C759' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2a9f47'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#34C759'}
                  >
                    Baca Selengkapnya →
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: '#b0b0b0' }}>Tidak ada materi yang ditemukan.</p>
          </div>
        )}

        {/* Modal for materi detail */}
        {selectedMateri && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMateri(null)}
          >
            <div 
              className="rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: '#2d2d2d' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FaBook className="text-primary-500" style={{ color: '#34C759' }} />
                      <h2 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>{selectedMateri.title}</h2>
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
                    className="ml-4 transition-colors"
                    style={{ color: '#b0b0b0' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#b0b0b0'}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="mb-4">
                  <p className="mb-4" style={{ color: '#b0b0b0' }}>{selectedMateri.description}</p>
                </div>
                <div className="pt-4" style={{ borderTop: '1px solid #404040' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#f5f5f5' }}>Isi Materi</h3>
                  <div className="prose max-w-none">
                    <p className="leading-relaxed" style={{ color: '#e5e5e5' }}>{selectedMateri.content}</p>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#252525' }}>
                  <p className="text-sm" style={{ color: '#b0b0b0' }}>
                    <strong>Catatan:</strong> Materi ini dapat disesuaikan dengan kondisi bahaya dan risiko di tempat Anda bekerja. 
                    Safety talks ini baik jika disampaikan setiap pagi sebelum memulai pekerjaan atau setiap memulai proyek baru.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Activity

