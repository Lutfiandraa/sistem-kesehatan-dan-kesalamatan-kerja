import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Splash from './pages/Splash'
import Dashboard from './pages/Dashboard'
import ReportIncident from './pages/ReportIncident'
import History from './pages/History'
import Statistics from './pages/Statistics'

function PrivateRoute({ children }) {
  return <Layout>{children}</Layout>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Website Routes Redirect to Private */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/catatan" element={<Navigate to="/report" />} />
      <Route path="/program-kerja" element={<Navigate to="/report" />} />
      <Route path="/catatan/pelaporan" element={<Navigate to="/report" />} />
      <Route path="/riwayat-pelaporan" element={<Navigate to="/history" />} />
      <Route path="/kegiatan" element={<Navigate to="/statistics" />} />
      <Route path="/kontak" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Navigate to="/dashboard" />} />
      
      {/* Private App Routes */}
      <Route path="/app" element={<Splash />} />
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

