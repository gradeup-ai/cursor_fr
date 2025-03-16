import React from 'react';
import { Candidate } from '../services/candidate.service';

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-indigo-600 truncate">
          {`${candidate.first_name} ${candidate.last_name}`}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {candidate.email}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Статус: {candidate.status}
        </p>
      </div>
    </div>
  );
};

export default CandidateCard; 