import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './Landing_page/Landing_page'
import HomePage from './Home_page/home_page'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
