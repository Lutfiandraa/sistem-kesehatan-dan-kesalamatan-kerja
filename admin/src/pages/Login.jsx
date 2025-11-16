import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  // Redirect ke Intro jika refresh di halaman Login
  useEffect(() => {
    // Check jika user sudah login, langsung ke dashboard
    if (user) {
      navigate('/dashboard')
      return
    }

    // Check jika sudah melewati intro dalam session ini
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro')
    
    // Jika belum melewati intro, atau jika ini adalah refresh (tidak ada flag fromIntro),
    // redirect ke intro
    const fromIntro = sessionStorage.getItem('fromIntro')
    
    if (!hasSeenIntro || !fromIntro) {
      // Clear flags dan redirect ke intro
      sessionStorage.removeItem('hasSeenIntro')
      sessionStorage.removeItem('fromIntro')
      navigate('/')
    } else {
      // Clear fromIntro flag setelah digunakan
      sessionStorage.removeItem('fromIntro')
    }
  }, [navigate, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message || 'Email atau Kata Sandi salah')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      {/* Green header area - sesuai desain mobile */}
      <div className="h-32 md:h-40 bg-green-400"></div>
      
      {/* Login card - sesuai desain mobile */}
      <div className="max-w-md mx-auto -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-black mb-8">
            Masuk
          </h1>
          
          <form onSubmit={handleSubmit} className="w-full">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                {error}
              </div>
            )}
            
            <div className="mb-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-3.5 border border-black rounded-lg text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>

            <div className="mb-6 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata Sandi"
                required
                className="w-full px-4 py-3.5 pr-12 border border-black rounded-lg text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl opacity-70 hover:opacity-100 transition-opacity"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-green-500 text-white rounded-xl font-bold text-base hover:bg-green-600 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Lanjut'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

