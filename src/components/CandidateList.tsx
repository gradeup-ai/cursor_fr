import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CandidateService, { Candidate, CandidateStatus } from '../services/candidate.service';

const getStatusColor = (status: CandidateStatus): string => {
  switch (status) {
    case 'hired':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'interviewed':
      return 'bg-blue-100 text-blue-800';
    case 'interview_scheduled':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: CandidateStatus): string => {
  switch (status) {
    case 'hired':
      return 'Нанят';
    case 'rejected':
      return 'Отклонен';
    case 'interviewed':
      return 'Проинтервьюирован';
    case 'interview_scheduled':
      return 'Интервью назначено';
    default:
      return 'Новый';
  }
};

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await CandidateService.getCandidates();
        setCandidates(response);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке кандидатов');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            <Link to={`/candidates/${candidate.id}`} className="block hover:bg-gray-50">
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
                  <div className="ml-4 flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(candidate.status)}`}>
                      {getStatusText(candidate.status)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateList; 