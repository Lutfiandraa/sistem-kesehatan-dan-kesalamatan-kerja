import { useParams, Link } from 'react-router-dom'
import { FaFile, FaDownload, FaFileAlt, FaCheckCircle, FaCheck } from 'react-icons/fa'

function Keanggotaan() {
  const { section } = useParams()

  const sections = {
    'download': {
      title: 'Halaman Download',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 mb-6">
            Download berbagai dokumen dan formulir terkait keanggotaan SafetyKU Indonesia.
          </p>
          <div className="space-y-3">
            {[
              { name: 'Formulir Pendaftaran Anggota', type: 'PDF', size: '245 KB' },
              { name: 'Panduan Keanggotaan', type: 'PDF', size: '1.2 MB' },
              { name: 'Syarat dan Ketentuan Keanggotaan', type: 'PDF', size: '890 KB' },
              { name: 'Struktur Organisasi', type: 'PDF', size: '456 KB' }
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl text-gray-600">
                    <FaFile />
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-white rounded-lg transition-colors" style={{ backgroundColor: '#34C759' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a9f47'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#34C759'}>
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'perundangan': {
      title: 'Perundangan',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 mb-6">
            Daftar peraturan perundangan terkait Keselamatan dan Kesehatan Kerja (K3).
          </p>
          <div className="space-y-3">
            {[
              { name: 'Undang-Undang No. 1 Tahun 1970 tentang Keselamatan Kerja', year: '1970' },
              { name: 'Peraturan Pemerintah No. 50 Tahun 2012 tentang Penerapan Sistem Manajemen K3', year: '2012' },
              { name: 'Peraturan Menteri Ketenagakerjaan No. 2 Tahun 2022 tentang Pencegahan dan Penanggulangan Kebakaran di Tempat Kerja', year: '2022' },
              { name: 'Peraturan Menteri Ketenagakerjaan No. 5 Tahun 2018 tentang Keselamatan dan Kesehatan Kerja Lingkungan Kerja', year: '2018' }
            ].map((law, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">{law.name}</h3>
                <p className="text-sm text-gray-500">Tahun: {law.year}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'pengecekan-lisensi': {
      title: 'Pengecekan Lisensi',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 mb-6">
            Cek status lisensi dan sertifikasi lembaga pelatihan K3.
          </p>
          <div className="bg-primary-50 border rounded-lg p-6" style={{ borderColor: '#a3e3b7' }}>
            <h3 className="font-semibold text-gray-900 mb-4">Cek Lisensi</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Lisensi
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nomor lisensi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  style={{ '--tw-ring-color': '#34C759' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#34C759'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lembaga
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lembaga"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  style={{ '--tw-ring-color': '#34C759' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#34C759'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#34C759' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a9f47'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#34C759'}
              >
                Cek Lisensi
              </button>
            </form>
          </div>
        </div>
      )
    }
  }

  const currentSection = sections[section] || {
    title: 'Keanggotaan',
    content: (
      <div className="space-y-6">
        <p className="text-gray-700">
          SafetyKU Indonesia membuka keanggotaan bagi lembaga-lembaga pelatihan Keselamatan dan Kesehatan Kerja (K3) di seluruh Indonesia.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/keanggotaan/download"
            className="p-6 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
          >
            <div className="text-4xl mb-4 text-gray-600">
              <FaDownload />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Halaman Download</h3>
            <p className="text-sm text-gray-600">Download formulir dan dokumen keanggotaan</p>
          </Link>
          <Link
            to="/keanggotaan/perundangan"
            className="p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
          >
            <div className="text-4xl mb-4 text-gray-600">
              <FaFileAlt />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Perundangan</h3>
            <p className="text-sm text-gray-600">Peraturan terkait K3</p>
          </Link>
          <Link
            to="/keanggotaan/pengecekan-lisensi"
            className="p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <div className="text-4xl mb-4 text-green-500">
              <FaCheckCircle />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Pengecekan Lisensi</h3>
            <p className="text-sm text-gray-600">Cek status lisensi lembaga</p>
          </Link>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-4">Syarat Keanggotaan</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 text-green-500 mt-1">
                <FaCheck />
              </span>
              <span>Memiliki izin operasional sebagai lembaga pelatihan K3</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500 mt-1">
                <FaCheck />
              </span>
              <span>Memiliki fasilitas pelatihan yang memadai</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500 mt-1">
                <FaCheck />
              </span>
              <span>Memiliki instruktur yang bersertifikat</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500 mt-1">
                <FaCheck />
              </span>
              <span>Berlaku selama 1 tahun dan dapat diperpanjang</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{currentSection.title}</h1>
          {currentSection.content}
        </div>
      </div>
    </div>
  )
}

export default Keanggotaan

