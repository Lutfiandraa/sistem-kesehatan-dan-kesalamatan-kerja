import PublicNavbar from './PublicNavbar'
import Footer from './Footer'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout

