import React from 'react';
import './App.css'
import MainPage from './pages/user/MainPage';
import ComplaintInfo from './pages/complaint/ComplaintInfo';
import ComplaintRegister from './pages/complaint/ComplaintRegister';
import ComplaintCreated from './pages/complaint/ComplaintCreated';
import ComplaintConsult from './pages/complaint/ComplaintConsult';
import ConsultResponse from './pages/complaint/ConsultResponse';
import { Route, Routes, BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<MainPage />} 
        />

        <Route 
          path="/complaint" 
          element={<ComplaintInfo />} 
        />

        <Route 
          path="/register" 
          element={<ComplaintRegister />} 
        />

        <Route 
          path="/finished_register" 
          element={<ComplaintCreated />} 
        />
        
        <Route 
          path="/consult" 
          element={<ComplaintConsult />} 
        />
        <Route path="/consult_response" element={<ConsultResponse />} />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;