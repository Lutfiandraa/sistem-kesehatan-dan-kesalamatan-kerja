import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCalendar, FaCloudUploadAlt, FaTimes } from 'react-icons/fa'
import api from '../../services/api'

function ProgramKerja() {
  const navigate = useNavigate()
  const dateInputRef = useRef(null)
  const [formData, setFormData] = useState({
    jenisInsiden: '',
    tanggal: '',
    lokasi: '',
    deskripsi: ''
  })
  const [photos, setPhotos] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      tanggal: e.target.value
    })
  }

  const handleIconClick = () => {
    dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()
  }

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'))
    const newPhotos = fileArray.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }))
    setPhotos([...photos, ...newPhotos])
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleRemovePhoto = (id) => {
    const photoToRemove = photos.find(p => p.id === id)
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.preview)
    }
    setPhotos(photos.filter(p => p.id !== id))
  }

  // Cleanup preview URLs saat component unmount
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        URL.revokeObjectURL(photo.preview)
      })
    }
  }, [photos])

  // Convert image file to base64 with size validation and compression
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // Validasi ukuran file (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        reject(new Error('Ukuran file terlalu besar. Maksimal 5MB.'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const base64String = e.target.result
          // Hapus data URL prefix jika ada (data:image/jpeg;base64,)
          const base64Data = base64String.includes(',') 
            ? base64String.split(',')[1] 
            : base64String
          
          // Validasi Base64 string
          if (!base64Data || base64Data.length === 0) {
            reject(new Error('Gagal mengkonversi gambar ke Base64'))
            return
          }

          console.log('Base64 conversion successful, length:', base64Data.length)
          resolve(base64Data)
        } catch (error) {
          reject(new Error('Gagal memproses gambar: ' + error.message))
        }
      }
      reader.onerror = (error) => {
        reject(new Error('Gagal membaca file gambar'))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validasi form
    if (!formData.jenisInsiden || !formData.tanggal || !formData.lokasi || !formData.deskripsi) {
      alert('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    setIsSubmitting(true)

    try {
      // Convert image to base64 jika ada
      let imageBase64 = null
      if (photos.length > 0 && photos[0].file) {
        try {
          imageBase64 = await convertImageToBase64(photos[0].file)
          console.log('Image converted to Base64, length:', imageBase64?.length)
        } catch (imageError) {
          alert(imageError.message || 'Gagal memproses gambar')
          setIsSubmitting(false)
          return
        }
      }

      // Format tanggal untuk backend (YYYY-MM-DD)
      const formattedDate = formData.tanggal

      // Tentukan severity dari jenis insiden
      const jenisInsidenLower = formData.jenisInsiden.toLowerCase()
      let severity = 'ringan'
      if (jenisInsidenLower.includes('berat')) {
        severity = 'berat'
      } else if (jenisInsidenLower.includes('kecelakaan') || jenisInsidenLower.includes('tunggal')) {
        severity = 'sedang'
      }

      // Buat title dari jenis insiden atau deskripsi
      const title = formData.jenisInsiden || formData.deskripsi.substring(0, 50)

      // Kirim data ke backend
      const response = await api.post('/public/reports', {
        title: title,
        description: formData.deskripsi,
        location: formData.lokasi,
        incident_date: formattedDate,
        severity: severity,
        jenis_insiden: formData.jenisInsiden,
        image: imageBase64 // Base64 string atau null
      })

      console.log('Report created successfully:', response.data)
      
      // Reset form
      setFormData({
        jenisInsiden: '',
        tanggal: '',
        lokasi: '',
        deskripsi: ''
      })
      
      // Cleanup photos
      photos.forEach(photo => {
        URL.revokeObjectURL(photo.preview)
      })
      setPhotos([])

      // Tampilkan success message
      alert('Laporan berhasil dikirim!')
      
      // Redirect ke halaman riwayat pelaporan
      navigate('/riwayat-pelaporan')
      
    } catch (error) {
      console.error('Error submitting report:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Gagal mengirim laporan. Silakan coba lagi.'
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: errorMessage
      })
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
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
            <h1 className="text-xl font-bold text-white">Pelaporan</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-pop-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Jenis Insiden */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Jenis Insiden:
              </label>
              <input
                type="text"
                name="jenisInsiden"
                value={formData.jenisInsiden}
                onChange={handleChange}
                placeholder="Ringan/Berat/Kecelakaan Tunggal/Laporan"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Tanggal :
              </label>
              <div className="relative">
                <input
                  ref={dateInputRef}
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleDateChange}
                  min="2000-01-01"
                  max="2030-12-31"
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  style={{
                    colorScheme: 'light',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                />
                <style>{`
                  input[type="date"]::-webkit-calendar-picker-indicator {
                    display: none;
                    -webkit-appearance: none;
                  }
                  input[type="date"]::-webkit-inner-spin-button,
                  input[type="date"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                  }
                `}</style>
                <button
                  type="button"
                  onClick={handleIconClick}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaCalendar className="w-5 h-5" />
                </button>
              </div>
              {formData.tanggal && (
                <p className="mt-2 text-sm text-gray-600">
                  {formatDateForDisplay(formData.tanggal)}
                </p>
              )}
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Lokasi :
              </label>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                placeholder="Lokasi Kejadian"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Deskripsi :
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Berikan Informasi"
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Upload Foto */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Tambahkan Foto (Jika ada)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <FaCloudUploadAlt className="text-4xl mb-3" style={{ color: '#34C759' }} />
                  <p className="text-gray-700 font-medium mb-1">
                    Drag & Drop foto di sini atau klik untuk memilih
                  </p>
                  <p className="text-sm text-gray-500">
                    Format yang didukung: JPG, PNG, GIF
                  </p>
                </div>
              </div>

              {/* Preview Foto */}
              {photos.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.preview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemovePhoto(photo.id)
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {photo.file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#34C759' }}
                onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#2a9f47')}
                onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#34C759')}
              >
                {isSubmitting ? 'Mengirim...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProgramKerja
