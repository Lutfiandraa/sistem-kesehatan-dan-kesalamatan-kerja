import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    // Set flag bahwa user sudah melewati intro
    sessionStorage.setItem('hasSeenIntro', 'true')
    
    const timer = setTimeout(() => {
      // Check if user is already logged in
      const token = localStorage.getItem('token')
      if (token) {
        navigate('/dashboard')
      } else {
        // Set flag bahwa redirect dari Intro ke Login
        sessionStorage.setItem('fromIntro', 'true')
        // Always go to login (no registration option)
        navigate('/login')
      }
    }, 2000) // Show intro for 2 seconds (1-3 seconds)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200 p-5">
      <div className="text-center max-w-2xl w-full">
        {/* Card dengan background hijau muda */}
        <div className="bg-green-100 rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in">
          {/* Logo dari assets */}
          <div className="mb-8 flex justify-center items-center">
            <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              <img 
                src="/keselamatanlogo.png" 
                alt="K3 Logo Keselamatan Kerja" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          </div>

          {/* Text - simple fade in */}
          <h1 className="text-4xl md:text-6xl font-bold mb-3 text-black animate-fade-in-delay">
            SafetyKU
          </h1>
          <p className="text-lg md:text-xl text-gray-700 animate-fade-in-delay-2">
            Kerja aman Kerja nyaman
          </p>
        </div>
      </div>
    </div>
  )
}

export default Splash

