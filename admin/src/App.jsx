import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import PublicLayout from './components/PublicLayout'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ReportIncident from './pages/ReportIncident'
import History from './pages/History'
import Statistics from './pages/Statistics'
import Home from './pages/public/Home'
import Catatan from './pages/public/Catatan'
import ProgramKerja from './pages/public/ProgramKerja'
import HasilPelaporan from './pages/public/HasilPelaporan'
import RiwayatPelaporan from './pages/public/RiwayatPelaporan'
import Kegiatan from './pages/public/Kegiatan'
import Contact from './pages/public/Contact'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading...
      </div>
    )
  }
  
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Website Routes */}
      <Route path="/" element={
        <PublicLayout>
          <Home />
        </PublicLayout>
      } />
      <Route path="/catatan" element={
        <PublicLayout>
          <Catatan />
        </PublicLayout>
      } />
      <Route path="/program-kerja" element={
        <PublicLayout>
          <ProgramKerja />
        </PublicLayout>
      } />
      <Route path="/catatan/pelaporan" element={
        <PublicLayout>
          <HasilPelaporan />
        </PublicLayout>
      } />
      <Route path="/riwayat-pelaporan" element={
        <PublicLayout>
          <RiwayatPelaporan />
        </PublicLayout>
      } />
      <Route path="/kegiatan" element={
        <PublicLayout>
          <Kegiatan />
        </PublicLayout>
      } />
      <Route path="/kontak" element={
        <PublicLayout>
          <Contact />
        </PublicLayout>
      } />
      
      {/* Private App Routes */}
      <Route path="/app" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/report" 
        element={
          <PrivateRoute>
            <ReportIncident />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/history" 
        element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/statistics" 
        element={
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        } 
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App

