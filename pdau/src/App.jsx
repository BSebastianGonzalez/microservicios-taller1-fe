import React from 'react';
import './App.css'
import MainPage from './pages/user/MainPage';
import ComplaintInfo from './pages/complaint/ComplaintInfo';
import ComplaintRegister from './pages/complaint/ComplaintRegister';
import ComplaintCreated from './pages/complaint/ComplaintCreated';
import ComplaintConsult from './pages/complaint/ComplaintConsult';
import ConsultResponse from './pages/complaint/ConsultResponse';
import ViewComplaints from './pages/complaint/ViewComplaints';
import ViewArchivedComplaints from './pages/complaint/ViewArchivedComplaints';
import LoginPage from './pages/admin/LoginPage';
import PasswordResetPage from './pages/admin/PasswordResetPage';
import PasswordConfirmPage from './pages/admin/PasswordConfirmPage';
import ChangePasswordPage from './pages/admin/ChangePasswordPage';
import AdminPage from './pages/admin/AdminPage';
import DataPage from './pages/admin/DataPage';
import LawFrame from './pages/user/LawFrame';
import ViewLaw from './pages/user/ViewLaw';
import StatisticsView from './pages/user/StatisticsView';
import DataUpdatePage from './pages/admin/DataUpdatePage';
import PersonalDocumentsPage from './pages/admin/PersonalDocumentsPage';
import ComplaintCheckout from './pages/admin/ComplaintCheckout';
import ResponseRegistrationPage from "./pages/admin/Responseregistrationpage";
import ManagementIndicatorsPage from './pages/admin/ManagementIndicatorsPage';
import ArchivedData from './modules/admin/components/archived_complaint/ArchivedSection';
import ArchivedComplaintCheckout from './pages/complaint/ArchivedComplaintCheckout';
import { Route, Routes, BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas del usuario */}
        <Route path="/" element={<MainPage />} />
        <Route path="/complaint" element={<ComplaintInfo />} />
        <Route path="/register" element={<ComplaintRegister />} />
        <Route path="/finished_register" element={<ComplaintCreated />} />
        <Route path="/consult" element={<ComplaintConsult />} />
        <Route path="/consult_response" element={<ConsultResponse />} />
        <Route path="/law_frame" element={<LawFrame />} />
        <Route path="/statistics_public" element={<StatisticsView />} />
        <Route path="/:id" element={<ViewLaw />} />
        
        {/* Rutas del administrador */}
        <Route path="/admin_login" element={<LoginPage />} />
        <Route path="/admin_password_reset" element={<PasswordResetPage />} />
        <Route path="/admin_password_confirm" element={<PasswordConfirmPage />} />
        <Route path="/admin_main" element={<AdminPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/admin_change_password" element={<ChangePasswordPage />} />
        <Route path="/data_update" element={<DataUpdatePage />} />
        <Route path="/personal_documents" element={<PersonalDocumentsPage />} />

        <Route path="/read_complaint" element={<ViewComplaints />} />
        <Route path="/complaint_checkout" element={<ComplaintCheckout />} />
        <Route path="/response_registration" element={<ResponseRegistrationPage />} />
        <Route path="/stats" element={<ManagementIndicatorsPage />} />

        <Route path="/archived_complaints" element={<ViewArchivedComplaints />} />
        <Route path="/archived_checkout" element={<ArchivedComplaintCheckout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;