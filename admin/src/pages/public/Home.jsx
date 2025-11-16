import { Link } from 'react-router-dom'
import { FaChartBar } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import api from '../../services/api'

function Home() {
  const [statistics, setStatistics] = useState({
    hasilPelaporan: {
      selesai: 0,
      menunggu: 0,
      ditangani: 0
    },
    kategori: {
      ringan: 0,
      berat: 0,
      kecelakaanTunggal: 0
    }
  })
  const [loading, setLoading] = useState(true)

  // Fetch data statistik dari backend
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Fetch semua laporan untuk menghitung statistik
        const response = await api.get('/public/reports')
        const reports = response.data || []

        // Hitung statistik Hasil Pelaporan berdasarkan status
        const hasilPelaporan = {
          selesai: reports.filter(r => {
            const status = r.status || 'belum_dicek'
            return status === 'aman' // Status "Aman!" dianggap selesai
          }).length,
          menunggu: reports.filter(r => {
            const status = r.status || 'belum_dicek'
            return status === 'belum_dicek' || status === 'belum_ditangani'
          }).length,
          ditangani: reports.filter(r => {
            const status = r.status || 'belum_dicek'
            return status === 'dalam_penangan'
          }).length
        }

        // Hitung statistik Kategori berdasarkan severity atau title
        const kategori = {
          ringan: reports.filter(r => {
            const severity = r.severity?.toLowerCase() || ''
            const title = r.title?.toLowerCase() || ''
            return severity === 'ringan' || title.includes('ringan')
          }).length,
          berat: reports.filter(r => {
            const severity = r.severity?.toLowerCase() || ''
            const title = r.title?.toLowerCase() || ''
            return severity === 'berat' || title.includes('berat')
          }).length,
          kecelakaanTunggal: reports.filter(r => {
            const severity = r.severity?.toLowerCase() || ''
            const title = r.title?.toLowerCase() || ''
            return severity === 'sedang' || 
                   title.includes('kecelakaan') || 
                   title.includes('tunggal') ||
                   (!severity && !title.includes('ringan') && !title.includes('berat'))
          }).length
        }

        setStatistics({
          hasilPelaporan,
          kategori
        })
      } catch (error) {
        console.error('Error fetching statistics:', error)
        // Tetap tampilkan 0 jika error
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  // Fungsi untuk menghitung persentase
  const calculatePercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  const totalHasilPelaporan = statistics.hasilPelaporan.selesai + 
                              statistics.hasilPelaporan.menunggu + 
                              statistics.hasilPelaporan.ditangani

  const totalKategori = statistics.kategori.ringan + 
                        statistics.kategori.berat + 
                        statistics.kategori.kecelakaanTunggal

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="text-white py-20 relative overflow-hidden"
        style={{
          backgroundImage: 'url(/safetybackground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Overlay untuk meningkatkan readability */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(1px)'
          }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ 
                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              SafetyKU Indonesia
            </h1>
            <p 
              className="text-xl md:text-2xl lg:text-3xl mb-8 font-semibold" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
              }}
            >
              Sistem Pelaporan Keselamatan dan Kesehatan Kerja
            </p>
            <p 
              className="text-lg md:text-xl mb-8 max-w-3xl mx-auto" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'
              }}
            >
              Meningkatkan kesadaran dan kompetensi keselamatan kerja di Indonesia melalui pelatihan dan pengembangan sumber daya manusia yang berkualitas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/program-kerja"
                className="px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 text-white border border-white"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Pelaporan
              </Link>
              <Link
                to="/kegiatan"
                className="px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 text-white border border-white"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Lihat Kegiatan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Statistik
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat statistik...</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Grafik Hasil Pelaporan */}
            <div className="bg-white rounded-xl shadow-lg p-6 animate-pop-in border border-gray-200">
              <div className="flex items-center mb-6">
                <FaChartBar className="text-2xl mr-3" style={{ color: '#34C759' }} />
                <h3 className="text-xl font-bold text-gray-900">Hasil Pelaporan</h3>
              </div>
              <div className="space-y-4">
                {/* Bar Chart */}
                <div className="space-y-3">
                  {/* Selesai */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Selesai</span>
                      <span className="text-sm font-bold text-gray-900">
                        {statistics.hasilPelaporan.selesai} ({calculatePercentage(statistics.hasilPelaporan.selesai, totalHasilPelaporan)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ 
                          width: `${calculatePercentage(statistics.hasilPelaporan.selesai, totalHasilPelaporan)}%`,
                          backgroundColor: '#34C759'
                        }}
                      >
                        <span className="text-xs text-white font-medium">
                          {statistics.hasilPelaporan.selesai}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menunggu */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Menunggu</span>
                      <span className="text-sm font-bold text-gray-900">
                        {statistics.hasilPelaporan.menunggu} ({calculatePercentage(statistics.hasilPelaporan.menunggu, totalHasilPelaporan)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ 
                          width: `${calculatePercentage(statistics.hasilPelaporan.menunggu, totalHasilPelaporan)}%`,
                          backgroundColor: '#FF9800'
                        }}
                      >
                        <span className="text-xs text-white font-medium">
                          {statistics.hasilPelaporan.menunggu}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ditangani */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Ditangani</span>
                      <span className="text-sm font-bold text-gray-900">
                        {statistics.hasilPelaporan.ditangani} ({calculatePercentage(statistics.hasilPelaporan.ditangani, totalHasilPelaporan)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ 
                          width: `${calculatePercentage(statistics.hasilPelaporan.ditangani, totalHasilPelaporan)}%`,
                          backgroundColor: '#2196F3'
                        }}
                      >
                        <span className="text-xs text-white font-medium">
                          {statistics.hasilPelaporan.ditangani}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Total */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Total</span>
                    <span className="text-lg font-bold text-gray-900">{totalHasilPelaporan}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grafik Kategori */}
            <div className="bg-white rounded-xl shadow-lg p-6 animate-pop-in-delay border border-gray-200">
              <div className="flex items-center mb-6">
                <FaChartBar className="text-2xl mr-3" style={{ color: '#34C759' }} />
                <h3 className="text-xl font-bold text-gray-900">Kategori</h3>
              </div>
              <div className="space-y-4">
                {/* Bar Chart */}
                <div className="space-y-3">
                  {/* Ringan */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Ringan</span>
                      <span className="text-sm font-bold text-gray-900">
                        {statistics.kategori.ringan} ({calculatePercentage(statistics.kategori.ringan, totalKategori)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ 
                          width: `${calculatePercentage(statistics.kategori.ringan, totalKategori)}%`,
                          backgroundColor: '#4CAF50'
                        }}
                      >
                        <span className="text-xs text-white font-medium">
                          {statistics.kategori.ringan}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Berat */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Berat</span>
                      <span className="text-sm font-bold text-gray-900">
                        {statistics.kategori.berat} ({calculatePercentage(statistics.kategori.berat, totalKategori)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ 
                          width: `${calculatePercentage(statistics.kategori.berat, totalKategori)}%`,
                          backgroundColor: '#F44336'
                        }}
                      >
                        <span className="text-xs text-white font-medium">
                          {statistics.kategori.berat}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Kecelakaan Tunggal */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Kecelakaan Tunggal</span>
                      <span className="text-sm font-bold text-gray-900">
                        {statistics.kategori.kecelakaanTunggal} ({calculatePercentage(statistics.kategori.kecelakaanTunggal, totalKategori)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ 
                          width: `${calculatePercentage(statistics.kategori.kecelakaanTunggal, totalKategori)}%`,
                          backgroundColor: '#FF9800'
                        }}
                      >
                        <span className="text-xs text-white font-medium">
                          {statistics.kategori.kecelakaanTunggal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Total */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Total</span>
                    <span className="text-lg font-bold text-gray-900">{totalKategori}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

    </div>
  )
}

export default Home

