import { Link } from 'react-router-dom'
import apd from '../../img/APD.png'
import evakuasi from '../../img/evakuasi.png'
import kesehatan from '../../img/kesehatan.png'
import safetybackground from '../../img/safetybackground.png'

// Helper function untuk truncate text
const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Data untuk 3 box konten pertama
const featuredMaterials = [
  {
    id: 'dummy-1',
    title: 'Pentingnya Alat Pelindung Diri (APD) di Tempat Kerja',
    description: 'Alat Pelindung Diri (APD) merupakan perlengkapan wajib yang harus digunakan oleh pekerja untuk melindungi diri dari bahaya di tempat kerja. Setiap pekerja harus memahami jenis APD yang sesuai dengan pekerjaannya.',
    category: 'Safety',
    image: apd
  },
  {
    id: 'dummy-2',
    title: 'Prosedur Evakuasi Darurat di Tempat Kerja',
    description: 'Setiap pekerja harus memahami prosedur evakuasi darurat di tempat kerja. Prosedur ini mencakup rute evakuasi, titik kumpul, dan langkah-langkah yang harus dilakukan saat terjadi keadaan darurat.',
    category: 'Safety',
    image: evakuasi
  },
  {
    id: 'dummy-3',
    title: 'Kesehatan Mental di Tempat Kerja',
    description: 'Kesehatan mental sama pentingnya dengan kesehatan fisik di tempat kerja. Stres kerja, beban kerja berlebihan, dan lingkungan kerja yang tidak sehat dapat mempengaruhi kesehatan mental pekerja.',
    category: 'Kesehatan',
    image: kesehatan
  }
]

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="text-white py-20 relative overflow-hidden"
        style={{
          backgroundImage: `url(${safetybackground})`,
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
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-8 sm:py-12 md:py-16" style={{ backgroundColor: '#1e1e1e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12" style={{ color: '#f5f5f5' }}>
            Artikel Terbaru
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMaterials.map((materi) => (
              <div
                key={materi.id}
                className="rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                style={{ 
                  backgroundColor: '#2d2d2d',
                  border: '1px solid #404040'
                }}
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
                  
                  <Link
                    to="/kegiatan"
                    className="text-sm font-medium transition-colors mt-auto inline-block"
                    style={{ color: '#34C759' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2a9f47'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#34C759'}
                  >
                    Baca Selengkapnya →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Button Lihat Lainnya */}
          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Link
              to="/kegiatan"
              className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: '#34C759'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a9f47'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#34C759'}
            >
              Lihat Lainnya
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
