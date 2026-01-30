import keselamatanlogo from '../assets/keselamatanlogo.png'

function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={keselamatanlogo} 
                alt="SafetyKU Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <span className="text-lg font-bold" style={{ color: '#f5f5f5' }}>SafetyKU</span>
                <p className="text-xs" style={{ color: '#b0b0b0' }}>Indonesia</p>
              </div>
            </div>
            <p className="text-sm" style={{ color: '#b0b0b0' }}>
              Sistem Pelaporan Keselamatan dan Kesehatan Kerja Indonesia
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#f5f5f5' }}>Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-xs" style={{ color: '#808080' }}>
                Email: info@safetyku.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm px-4" style={{ borderTop: '1px solid #404040' }}>
          <p className="break-words" style={{ color: '#808080' }}>Copyright © 2025 SafetyKU - Sistem Pelaporan Keselamatan dan Kesehatan Kerja | AndraIndustries</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
