import Navbar from '../pages/Navbar'
import Footer from './Footer'
import PageTransition from './PageTransition'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1e1e1e' }}>
      <Navbar />
      {/* Spacer untuk fixed navbar - tinggi navbar sekitar 64-80px (h-16 md:h-20) */}
      <div className="h-16 md:h-20"></div>
      <main className="flex-grow">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout

