import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'
import Home from './pages/Home'
import Regulatory from './pages/Regulatory'
import Activity from './pages/Activity'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        } />
        <Route path="/catatan" element={
          <PublicLayout>
            <Regulatory />
          </PublicLayout>
        } />
        <Route path="/kegiatan" element={
          <PublicLayout>
            <Activity />
          </PublicLayout>
        } />
      </Routes>
    </Router>
  )
}

export default App
