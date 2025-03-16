import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CandidateService, { Candidate } from '../../services/candidate.service';

const InterviewComplete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        if (!id) return;
        const data = await CandidateService.getCandidate(id);
        setCandidate(data);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (!candidate) {
    return <div className="text-center py-12">Кандидат не найден</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Спасибо за интервью, {candidate.first_name}!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Наша команда HR проанализирует результаты интервью
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <img
                src="/emily-avatar.png"
                alt="AI-HR Эмили"
                className="mx-auto h-32 w-32 rounded-full"
              />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                AI-HR Эмили
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Ваш виртуальный интервьюер
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900">
                Следующие шаги:
              </h4>
              <ul className="mt-2 text-sm text-gray-600 space-y-2">
                <li>• Наша команда HR проанализирует результаты интервью</li>
                <li>• Мы свяжемся с вами по email для дальнейших шагов</li>
                <li>• Обычно это занимает 2-3 рабочих дня</li>
              </ul>
            </div>

            <div>
              <button
                onClick={() => navigate('/')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Вернуться на главную
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewComplete; 