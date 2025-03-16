import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Interview } from '../../services/interview.service';

const AdminPanel: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch('/api/interviews');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке интервью');
        }
        const data = await response.json();
        setInterviews(data);
      } catch (err) {
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Панель администратора
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {interviews.map((interview) => (
              <li key={interview.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {interview.candidate_name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(interview.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      interview.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : interview.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {interview.status === 'completed' && 'Завершено'}
                      {interview.status === 'in_progress' && 'В процессе'}
                      {interview.status === 'scheduled' && 'Запланировано'}
                    </span>
                    <Link
                      to={`/interview/${interview.id}`}
                      className="ml-4 text-indigo-600 hover:text-indigo-900"
                    >
                      Просмотр
                    </Link>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Дата: {new Date(interview.created_at).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;