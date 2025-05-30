import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Form from './pages/Form';
import CareerLayout from './pages/CareerLayout';
import mockCareerData from './data/mockCareerData';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<Form />} />
        <Route path="/mentorship" element={<CareerLayout mockCareerData={mockCareerData} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
