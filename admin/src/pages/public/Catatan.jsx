import { Link } from 'react-router-dom'
import { FaEdit, FaClipboardList } from 'react-icons/fa'

function Catatan() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Catatan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pembuatan Pelaporan */}
          <Link
            to="/program-kerja"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow animate-pop-in"
          >
            <div className="text-center">
              <div className="text-5xl mb-4 text-gray-600 flex justify-center">
                <FaEdit />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Pembuatan Pelaporan</h2>
              <p className="text-gray-600 text-sm">
                Buat laporan insiden baru
              </p>
            </div>
          </Link>

          {/* Hasil Pelaporan */}
          <Link
            to="/riwayat-pelaporan"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow animate-pop-in-delay"
          >
            <div className="text-center">
              <div className="text-5xl mb-4 text-gray-600 flex justify-center">
                <FaClipboardList />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Hasil Pelaporan</h2>
              <p className="text-gray-600 text-sm">
                Lihat riwayat pelaporan
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Catatan

