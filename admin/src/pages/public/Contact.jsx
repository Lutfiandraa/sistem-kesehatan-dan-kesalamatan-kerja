import { useState } from 'react'
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock, FaCheckCircle } from 'react-icons/fa'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 animate-pop-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Hubungi Kami</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informasi Kontak</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl text-gray-600 mt-1">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Alamat</h3>
                    <p className="text-gray-600 text-sm">
                      Jl. Jenderal Sudirman No. 123<br />
                      Jakarta Pusat 10220<br />
                      Indonesia
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl text-gray-600 mt-1">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600 text-sm">info@safetyku.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl text-gray-600 mt-1">
                    <FaPhone />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Telepon</h3>
                    <p className="text-gray-600 text-sm">+62 21 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl text-gray-600 mt-1">
                    <FaClock />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Jam Operasional</h3>
                    <p className="text-gray-600 text-sm">
                      Senin - Jumat: 08:00 - 17:00 WIB<br />
                      Sabtu: 08:00 - 12:00 WIB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Kirim Pesan</h2>
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2 text-green-600 flex justify-center">
                    <FaCheckCircle />
                  </div>
                  <p className="text-green-700 font-medium">Pesan berhasil dikirim!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama *
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#34C759'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#34C759'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subjek *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#34C759'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#34C759'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 text-white rounded-lg transition-colors font-medium"
                    style={{ backgroundColor: '#34C759' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a9f47'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#34C759'}
                  >
                    Kirim Pesan
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

