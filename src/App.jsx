import LandingPage from './pages/LandingPage';
import Form from './pages/Form';
import CareerLayout from './pages/CareerLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<Form />} />
        <Route path="/tep" element={<CareerLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
