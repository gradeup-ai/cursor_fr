import React from 'react';
import { Link } from 'react-router-dom';
import { Interview } from '../services/interview.service';

interface InterviewListProps {
  interviews: Interview[];
}

const InterviewList: React.FC<InterviewListProps> = ({ interviews }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {interviews.map((interview) => (
          <li key={interview.id}>
            <Link to={`/interviews/${interview.id}`} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {interview.candidate_name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(interview.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      interview.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : interview.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {interview.status === 'completed' 
                        ? 'Завершено'
                        : interview.status === 'in_progress'
                        ? 'В процессе'
                        : 'Запланировано'
                      }
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

export default InterviewList; 