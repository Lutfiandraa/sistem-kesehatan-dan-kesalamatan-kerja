import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#E8F5E9] font-sans lg:flex select-none">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden min-h-screen">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
