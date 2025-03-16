import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CandidateRegistration from '../components/Candidates/CandidateRegistration';
import Interview from '../components/Interviews/Interview';
import Layout from '../components/Layout/Layout';
import AdminPanel from '../components/Admin/AdminPanel';
import VacanciesList from '../components/Vacancies/VacanciesList';
import NotFound from '../components/Common/NotFound';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/register" element={<CandidateRegistration />} />
        <Route path="/interview/:id" element={<Interview />} />

        {/* Маршруты админ-панели */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<AdminPanel />} />
          <Route path="vacancies" element={<VacanciesList />} />
        </Route>

        {/* Редирект с главной на регистрацию */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        
        {/* 404 страница */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router; 