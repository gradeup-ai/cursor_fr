import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InterviewService from '../../services/interview.service';
import type { Interview as InterviewType } from '../../services/interview.service';

const getStatusColor = (status: InterviewType['status']): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'scheduled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: InterviewType['status']): string => {
  switch (status) {
    case 'completed':
      return 'Завершено';
    case 'in_progress':
      return 'В процессе';
    case 'scheduled':
      return 'Запланировано';
    default:
      return 'Неизвестно';
  }
};

const Interview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<InterviewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInterview = async () => {
      try {
        if (!id) return;
        const data = await InterviewService.getInterview(id);
        setInterview(data);
      } catch {
        setError('Ошибка при загрузке интервью');
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [id]);

  const startInterview = async () => {
    try {
      if (!id) return;
      await InterviewService.startInterview(id);
      // Обновляем данные интервью
      const data = await InterviewService.getInterview(id);
      setInterview(data);
    } catch {
      setError('Ошибка при начале интервью');
    }
  };

  const endInterview = async () => {
    try {
      if (!id) return;
      await InterviewService.endInterview(id);
      // Обновляем данные интервью
      const data = await InterviewService.getInterview(id);
      setInterview(data);
    } catch {
      setError('Ошибка при завершении интервью');
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!interview) {
    return <div>Интервью не найдено</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Интервью с {interview.candidate_name}
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Детали интервью
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Статус</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
                    {getStatusText(interview.status)}
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Дата создания</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(interview.created_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          {interview.status === 'scheduled' && (
            <button
              onClick={startInterview}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Начать интервью
            </button>
          )}
          {interview.status === 'in_progress' && (
            <button
              onClick={endInterview}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Завершить интервью
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview; 