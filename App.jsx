import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import LandingPage from './component/LandingPage'
import Form from './component/Form'

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="hidden">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/form">Formulário</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App