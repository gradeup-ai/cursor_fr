import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CandidateService, { Candidate } from '../../services/candidate.service';

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await CandidateService.getCandidates();
        setCandidates(data);
      } catch (err) {
        setError('Ошибка при загрузке кандидатов');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого кандидата?')) {
      try {
        await CandidateService.deleteCandidate(id);
        setCandidates(candidates.filter(c => c.id !== id));
      } catch (err) {
        setError('Ошибка при удалении кандидата');
        console.error(err);
      }
    }
  };

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'interview_scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'interviewed':
        return 'bg-purple-100 text-purple-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Candidate['status']) => {
    switch (status) {
      case 'new':
        return 'Новый';
      case 'interview_scheduled':
        return 'Запланировано интервью';
      case 'interviewed':
        return 'Прошел интервью';
      case 'hired':
        return 'Нанят';
      case 'rejected':
        return 'Отклонен';
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
        <h1 className="text-3xl font-bold text-gray-900">Кандидаты</h1>
        <Link
          to="/candidates/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Добавить кандидата
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {`${candidate.first_name} ${candidate.last_name}`}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {candidate.email}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-4">
                    <Link
                      to={`/candidates/${candidate.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(candidate.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                      {getStatusText(candidate.status)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Добавлен {new Date(candidate.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CandidateList; 