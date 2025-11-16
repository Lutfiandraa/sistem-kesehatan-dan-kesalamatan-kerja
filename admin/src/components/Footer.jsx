import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/keselamatanlogo.png" 
                alt="SafetyKU Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <span className="text-lg font-bold text-white">SafetyKU</span>
                <p className="text-xs">Indonesia</p>
              </div>
            </div>
            <p className="text-sm">
              Sistem Pelaporan Keselamatan dan Kesehatan Kerja Indonesia
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/program-kerja" className="hover:text-white transition-colors">Pembuatan Pelaporan</Link>
              </li>
              <li>
                <Link to="/catatan/pelaporan" className="hover:text-white transition-colors">Pelaporan</Link>
              </li>
              <li>
                <Link to="/riwayat-pelaporan" className="hover:text-white transition-colors">Riwayat Pelaporan</Link>
              </li>
              <li>
                <Link to="/kegiatan" className="hover:text-white transition-colors">Kegiatan</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-xs text-gray-400">
                Email: info@safetyku.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>Copyright © 2025 SafetyKU - Sistem Pelaporan Keselamatan dan Kesehatan Kerja | AndraIndustries</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

