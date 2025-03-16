import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InterviewResultsService, { InterviewResult, InterviewAnalytics } from '../../services/interview-results.service';
import CandidateService, { Candidate } from '../../services/candidate.service';

const InterviewResultsList: React.FC = () => {
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [candidates, setCandidates] = useState<Record<string, Candidate>>({});
  const [analytics, setAnalytics] = useState<InterviewAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultsData, analyticsData] = await Promise.all([
          InterviewResultsService.getInterviewResults(),
          InterviewResultsService.getInterviewAnalytics()
        ]);

        setResults(resultsData);
        setAnalytics(analyticsData);

        // Загружаем данные кандидатов
        const candidatesData: Record<string, Candidate> = {};
        for (const result of resultsData) {
          if (!candidatesData[result.candidate_id]) {
            const candidate = await CandidateService.getCandidate(result.candidate_id);
            candidatesData[result.candidate_id] = candidate;
          }
        }
        setCandidates(candidatesData);
      } catch (err) {
        setError('Ошибка загрузки данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredResults = results
    .filter(result => {
      const candidate = candidates[result.candidate_id];
      const matchesSearch = searchQuery === '' || 
        (candidate && 
          (candidate.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           candidate.last_name.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return (b.hr_rating || 0) - (a.hr_rating || 0);
      }
    });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Ошибка загрузки данных
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        Результаты интервью не найдены
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок и статистика */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Результаты интервью
          </h1>
          {analytics && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Всего интервью</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{analytics.total_interviews}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">На рассмотрении</h3>
                <p className="mt-1 text-2xl font-semibold text-yellow-600">{analytics.pending_review}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Принято</h3>
                <p className="mt-1 text-2xl font-semibold text-green-600">{analytics.acceptance_rate}%</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Отклонено</h3>
                <p className="mt-1 text-2xl font-semibold text-red-600">{analytics.rejection_rate}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Фильтры и поиск */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Поиск по имени кандидата
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Введите имя или фамилию"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="status-select"
              >
                Статус
              </label>
              <select
                id="status-select"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Все</option>
                <option value="pending">На рассмотрении</option>
                <option value="accepted">Принято</option>
                <option value="rejected">Отклонено</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="sort-select"
                className="block text-sm font-medium text-gray-700"
              >
                Сортировка
              </label>
              <select
                id="sort-select"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
              >
                <option value="date">По дате</option>
                <option value="rating">По оценке</option>
              </select>
            </div>
          </div>
        </div>

        {/* Список результатов */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Кандидат
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Длительность
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Оценка
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result) => {
                  const candidate = candidates[result.candidate_id];
                  return (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {candidate ? `${candidate.first_name} ${candidate.last_name}` : 'Загрузка...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(result.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {Math.round(result.duration / 60)} мин
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {result.hr_rating || 'Не оценено'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          result.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          result.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {result.status === 'accepted' ? 'Принят' :
                           result.status === 'rejected' ? 'Отклонен' : 'На рассмотрении'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/interviews/${result.id}/results`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Просмотр
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResultsList; 