import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function PageTransition({ children }) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('page-initial')
  const [isInitial, setIsInitial] = useState(true)

  useEffect(() => {
    if (isInitial) {
      // Initial page load - trigger animation after mount
      const timer = setTimeout(() => {
        setIsInitial(false)
        setTransitionStage('page-enter-active')
      }, 50)
      return () => clearTimeout(timer)
    }

    if (location.pathname !== displayLocation.pathname) {
      // Page change - start exit animation
      setTransitionStage('page-exit')
      
      // Wait for exit animation to complete, then change content
      const timeoutId = setTimeout(() => {
        setDisplayLocation(location)
        setTransitionStage('page-enter')
        
        // Scroll to top when navigating to new page
        window.scrollTo(0, 0)
        
        // Trigger enter animation
        setTimeout(() => {
          setTransitionStage('page-enter-active')
        }, 10)
      }, 300)
      
      return () => clearTimeout(timeoutId)
    }
  }, [location, displayLocation, isInitial])

  return (
    <div className={transitionStage} style={{ width: '100%' }}>
      {children}
    </div>
  )
}

export default PageTransition

