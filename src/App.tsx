import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import VacancyList from './components/Vacancies/VacancyList';
import VacancyForm from './components/Vacancies/VacancyForm';
import CandidateList from './components/Candidates/CandidateList';
import CandidateForm from './components/Candidates/CandidateForm';
import CandidateRegistration from './components/Candidates/CandidateRegistration';
import InterviewList from './components/Interviews/InterviewList';
import InterviewForm from './components/Interviews/InterviewForm';
import InterviewRoom from './components/Interviews/InterviewRoom';
import InterviewWaiting from './components/Interviews/InterviewWaiting';
import InterviewComplete from './components/Interviews/InterviewComplete';
import InterviewResults from './components/Interviews/InterviewResults';
import InterviewResultsList from './components/Interviews/InterviewResultsList';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/vacancies" element={<ProtectedRoute><VacancyList /></ProtectedRoute>} />
            <Route path="/vacancies/new" element={<ProtectedRoute><VacancyForm /></ProtectedRoute>} />
            <Route path="/vacancies/:id/edit" element={<ProtectedRoute><VacancyForm /></ProtectedRoute>} />
            <Route path="/candidates" element={<ProtectedRoute><CandidateList /></ProtectedRoute>} />
            <Route path="/candidates/new" element={<ProtectedRoute><CandidateForm /></ProtectedRoute>} />
            <Route path="/candidates/:id/edit" element={<ProtectedRoute><CandidateForm /></ProtectedRoute>} />
            <Route path="/candidates/register" element={<CandidateRegistration />} />
            <Route path="/interviews" element={<ProtectedRoute><InterviewList /></ProtectedRoute>} />
            <Route path="/interviews/new" element={<ProtectedRoute><InterviewForm /></ProtectedRoute>} />
            <Route path="/interviews/:id/edit" element={<ProtectedRoute><InterviewForm /></ProtectedRoute>} />
            <Route path="/interviews/:id/room" element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>} />
            <Route path="/interviews/:id/results" element={<ProtectedRoute><InterviewResults /></ProtectedRoute>} />
            <Route path="/interview-results" element={<ProtectedRoute><InterviewResultsList /></ProtectedRoute>} />
            <Route path="/interview/:id" element={<InterviewWaiting />} />
            <Route path="/interview/:id/complete" element={<InterviewComplete />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
