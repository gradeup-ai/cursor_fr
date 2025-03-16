import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InterviewService, { Interview } from '../../services/interview.service';
import CandidateService, { Candidate } from '../../services/candidate.service';
import VacancyService, { Vacancy } from '../../services/vacancy.service';

const InterviewList: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Record<string, Candidate>>({});
  const [vacancies, setVacancies] = useState<Record<string, Vacancy>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewsData, candidatesData, vacanciesData] = await Promise.all([
          InterviewService.getInterviews(),
          CandidateService.getCandidates(),
          VacancyService.getVacancies()
        ]);

        setInterviews(interviewsData);
        setCandidates(candidatesData.reduce((acc, c) => ({ ...acc, [c.id]: c }), {}));
        setVacancies(vacanciesData.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}));
      } catch (err) {
        setError('Ошибка при загрузке данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это интервью?')) {
      try {
        await InterviewService.deleteInterview(id);
        setInterviews(interviews.filter(i => i.id !== id));
      } catch (err) {
        setError('Ошибка при удалении интервью');
        console.error(err);
      }
    }
  };

  const handleStart = async (id: string) => {
    try {
      const updatedInterview = await InterviewService.startInterview(id);
      setInterviews(interviews.map(i => i.id === id ? updatedInterview : i));
    } catch (err) {
      setError('Ошибка при запуске интервью');
      console.error(err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const updatedInterview = await InterviewService.completeInterview(id);
      setInterviews(interviews.map(i => i.id === id ? updatedInterview : i));
    } catch (err) {
      setError('Ошибка при завершении интервью');
      console.error(err);
    }
  };

  const getStatusColor = (status: Interview['status']): string => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Interview['status']): string => {
    switch (status) {
      case 'scheduled':
        return 'Запланировано';
      case 'in_progress':
        return 'В процессе';
      case 'completed':
        return 'Завершено';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Интервью</h1>
        <Link
          to="/interviews/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Запланировать интервью
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {interviews.map((interview) => {
            const candidate = candidates[interview.candidate_id];
            const vacancy = vacancies[interview.vacancy_id];

            return (
              <li key={interview.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {candidate ? `${candidate.first_name} ${candidate.last_name}` : 'Кандидат не найден'}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {vacancy?.title || 'Вакансия не найдена'}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-4">
                      {interview.status === 'scheduled' && (
                        <button
                          onClick={() => handleStart(interview.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Начать
                        </button>
                      )}
                      {interview.status === 'in_progress' && (
                        <button
                          onClick={() => handleComplete(interview.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Завершить
                        </button>
                      )}
                      <Link
                        to={`/interviews/${interview.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Редактировать
                      </Link>
                      <button
                        onClick={() => handleDelete(interview.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(interview.status)}`}>
                        {getStatusText(interview.status)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {new Date(interview.scheduled_at).toLocaleString()} • {interview.duration} мин
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default InterviewList; 