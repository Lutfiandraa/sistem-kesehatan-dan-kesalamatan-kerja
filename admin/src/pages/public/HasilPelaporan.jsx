import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function HasilPelaporan() {
  const navigate = useNavigate()

  // Sample data sesuai dengan Riwayat Pelaporan tapi tanpa filter
  const reports = [
    {
      id: 1,
      title: 'Berat',
      date: '21 Oktober 2025',
      description: 'Patah as roda Hino 700 di lokasi',
      severity: 'berat',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Kecelakaan Tunggal',
      date: '15 September 2025',
      description: 'Teknisi terjepit pipa kilang',
      severity: 'sedang',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Ringan',
      date: '8 Agustus 2025',
      description: 'Kerusakan Welding Torch di lokasi',
      severity: 'ringan',
      status: 'selesai'
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#34C759' }}>
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Pelaporan</h1>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {reports.map((report, index) => (
            <div
              key={report.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden relative ${
                index === 0 ? 'animate-pop-in' : 
                index === 1 ? 'animate-pop-in-delay' : 
                'animate-pop-in-delay-2'
              }`}
            >
              {/* Red stripe for "Berat" severity */}
              {report.severity === 'berat' && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
              )}
              
              <div className="p-4 pl-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-gray-900">{report.title}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-1">{report.date}</p>
                <p className="text-sm text-gray-700 mb-4">{report.description}</p>
                
                <div className="flex justify-end">
                  <button
                    className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all"
                    style={{ backgroundColor: '#34C759' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a9f47'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#34C759'}
                  >
                    Lihat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HasilPelaporan

