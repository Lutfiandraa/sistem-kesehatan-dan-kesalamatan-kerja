import { useParams, Link } from 'react-router-dom'

function Profile() {
  const { period } = useParams()

  const periods = {
    'pengurus-2021-2026': {
      title: 'Pengurus Periode 2021-2026',
      data: [
        { position: 'Ketua Umum', name: 'Dr. Ir. Ahmad Hidayat, M.T.' },
        { position: 'Sekretaris Jenderal', name: 'Ir. Budi Santoso, M.M.' },
        { position: 'Bendahara', name: 'Drs. Siti Nurhaliza, M.M.' },
        { position: 'Ketua Bidang Pelatihan', name: 'Ir. Joko Widodo, M.T.' },
        { position: 'Ketua Bidang Sertifikasi', name: 'Dr. Maria Santoso, S.T., M.T.' }
      ]
    },
    'pengurus-2018-2021': {
      title: 'Pengurus Periode 2018-2021',
      data: [
        { position: 'Ketua Umum', name: 'Prof. Dr. Ir. Soekarno, M.T.' },
        { position: 'Sekretaris Jenderal', name: 'Ir. Ahmad Dahlan, M.M.' },
        { position: 'Bendahara', name: 'Drs. Kartini, M.M.' }
      ]
    },
    'pengurus-2013-2016': {
      title: 'Pengurus Periode 2013-2016',
      data: [
        { position: 'Ketua Umum', name: 'Dr. Ir. Soeharto, M.T.' },
        { position: 'Sekretaris Jenderal', name: 'Ir. Bung Karno, M.M.' }
      ]
    },
    'sejarah': {
      title: 'Sejarah Pembentukan SafetyKU Indonesia',
      content: `
        <p class="mb-4">
          SafetyKU Indonesia didirikan dengan tujuan untuk meningkatkan kualitas pelatihan K3 di Indonesia dan mengembangkan kompetensi sumber daya manusia di bidang keselamatan dan kesehatan kerja.
        </p>
        <p class="mb-4">
          SafetyKU Indonesia resmi berdiri pada tahun 2010 sebagai wadah bagi lembaga-lembaga pelatihan K3 di seluruh Indonesia untuk bersinergi dalam meningkatkan standar pelatihan dan sertifikasi K3.
        </p>
        <p class="mb-4">
          Sejak berdirinya, SafetyKU Indonesia telah aktif dalam berbagai kegiatan pelatihan, workshop, dan sosialisasi terkait keselamatan dan kesehatan kerja, serta bekerja sama dengan berbagai instansi pemerintah dan swasta.
        </p>
        <p>
          Visi SafetyKU Indonesia adalah menjadi asosiasi terdepan dalam pengembangan dan peningkatan kualitas pelatihan K3 di Indonesia, sementara misinya adalah meningkatkan kompetensi dan profesionalisme lembaga pelatihan K3 melalui program-program yang berkualitas.
        </p>
      `
    }
  }

  const currentPeriod = periods[period] || periods['pengurus-2021-2026']

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{currentPeriod.title}</h1>
          
          {period === 'sejarah' ? (
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: currentPeriod.content }}
            />
          ) : (
            <div className="space-y-6">
              {currentPeriod.data.map((member, index) => (
                <div 
                  key={index}
                  className="border-l-4 pl-6 py-4 bg-primary-50 rounded-r-lg"
                  style={{ borderColor: '#34C759' }}
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{member.position}</h3>
                  <p className="text-gray-700">{member.name}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Periode Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/profil/pengurus-2021-2026"
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Pengurus Periode 2021-2026</h3>
              </Link>
              <Link 
                to="/profil/pengurus-2018-2021"
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Pengurus Periode 2018-2021</h3>
              </Link>
              <Link 
                to="/profil/pengurus-2013-2016"
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Pengurus Periode 2013-2016</h3>
              </Link>
              <Link 
                to="/profil/sejarah"
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Sejarah Pembentukan</h3>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

