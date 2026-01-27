import { 
  FaWrench, 
  FaShieldAlt, 
  FaClipboardCheck, 
  FaDolly, 
  FaHardHat,
  FaHeartbeat,
  FaLifeRing,
  FaCog,
  FaClipboardList,
  FaCar
} from 'react-icons/fa'

function Regulatory() {
  const rules = [
    {
      id: 1,
      title: 'Tools & Equipment',
      icon: FaWrench,
      color: '#374151'
    },
    {
      id: 2,
      title: 'Safety Zone Position',
      icon: FaShieldAlt,
      color: '#374151'
    },
    {
      id: 3,
      title: 'Permit to Work',
      icon: FaClipboardCheck,
      color: '#374151'
    },
    {
      id: 4,
      title: 'Lifting Operations',
      icon: FaDolly,
      color: '#374151'
    },
    {
      id: 5,
      title: 'Excavation & Ground Disturbance',
      icon: FaHardHat,
      color: '#374151'
    },
    {
      id: 6,
      title: 'Healthy Environment',
      icon: FaHeartbeat,
      color: '#374151'
    },
    {
      id: 7,
      title: 'Personal Floatation Device',
      icon: FaLifeRing,
      color: '#374151'
    },
    {
      id: 8,
      title: 'System Override',
      icon: FaCog,
      color: '#374151'
    },
    {
      id: 9,
      title: 'Asset Integrity',
      icon: FaClipboardList,
      color: '#374151'
    },
    {
      id: 10,
      title: 'Safety Driving',
      icon: FaCar,
      color: '#374151'
    }
  ]

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#1e1e1e' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: '#f5f5f5' }}>
            CORPORATE LIFE SAVING RULES
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto" style={{ color: '#b0b0b0' }}>
            Aturan keselamatan yang wajib dipatuhi untuk memastikan keselamatan dan kesehatan kerja di lingkungan perusahaan
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10">
          {rules.map((rule) => {
            const IconComponent = rule.icon
            return (
              <div
                key={rule.id}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Circular Icon Container */}
                <div className="relative mb-4">
                  {/* Outer Green Ring */}
                  <div 
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(360deg, #166534 0%, #166534 100%)',
                      padding: '4px'
                    }}
                  >
                    {/* White Inner Circle with Gauge Marks */}
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative shadow-lg">
                      {/* Gauge Marks */}
                      <svg 
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 100 100"
                      >
                        {[...Array(12)].map((_, i) => {
                          const angle = (i * 30) - 90
                          const x1 = 50 + 40 * Math.cos((angle * Math.PI) / 180)
                          const y1 = 50 + 40 * Math.sin((angle * Math.PI) / 180)
                          const x2 = 50 + 45 * Math.cos((angle * Math.PI) / 180)
                          const y2 = 50 + 45 * Math.sin((angle * Math.PI) / 180)
                          return (
                            <line
                              key={i}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="#E5E7EB"
                              strokeWidth="1.5"
                            />
                          )
                        })}
                      </svg>
                      
                      {/* Icon */}
                      <IconComponent 
                        className="relative z-10"
                        style={{ 
                          color: rule.color
                        }}
                        size={40}
                      />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center leading-tight transition-colors" style={{ color: '#e5e5e5' }}>
                  {rule.title}
                </h3>
              </div>
            )
          })}
        </div>

        {/* Additional Information Section */}
        <div className="mt-16 sm:mt-20 md:mt-24 rounded-xl shadow-lg p-6 sm:p-8 md:p-10" style={{ backgroundColor: '#2d2d2d' }}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: '#f5f5f5' }}>
            Tentang Corporate Life Saving Rules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: '#f5f5f5' }}>
                Tujuan
              </h3>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#b0b0b0' }}>
                Corporate Life Saving Rules dirancang untuk mencegah kecelakaan fatal dan cedera serius di tempat kerja. 
                Aturan-aturan ini merupakan standar minimum yang harus dipatuhi oleh semua karyawan dan kontraktor.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: '#f5f5f5' }}>
                Komitmen
              </h3>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#b0b0b0' }}>
                Setiap individu bertanggung jawab untuk memahami, mematuhi, dan menegakkan aturan-aturan ini. 
                Keselamatan adalah prioritas utama dan tidak dapat dikompromikan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Regulatory

