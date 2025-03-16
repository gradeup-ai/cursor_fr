import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewService, { CreateInterviewData } from '../../services/interview.service';

interface InterviewFormProps {
  onSubmit?: (data: CreateInterviewData) => void;
}

const InterviewForm: React.FC<InterviewFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CreateInterviewData>({
    candidate_id: '',
    vacancy_id: '',
    scheduled_at: '',
    duration: 60,
    interview_type: 'technical',
    status: 'scheduled'
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        const interview = await InterviewService.createInterview(formData);
        navigate(`/interviews/${interview.id}`);
      }
    } catch {
      setError('Ошибка при создании интервью');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value, 10) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}

      <div>
        <label htmlFor="candidate_id" className="block text-sm font-medium text-gray-700">
          ID кандидата
        </label>
        <input
          type="text"
          id="candidate_id"
          name="candidate_id"
          value={formData.candidate_id}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="vacancy_id" className="block text-sm font-medium text-gray-700">
          ID вакансии
        </label>
        <input
          type="text"
          id="vacancy_id"
          name="vacancy_id"
          value={formData.vacancy_id}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700">
          Дата и время
        </label>
        <input
          type="datetime-local"
          id="scheduled_at"
          name="scheduled_at"
          value={formData.scheduled_at}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Длительность (минуты)
        </label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
          min="15"
          max="180"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="interview_type" className="block text-sm font-medium text-gray-700">
          Тип интервью
        </label>
        <select
          id="interview_type"
          name="interview_type"
          value={formData.interview_type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="technical">Техническое</option>
          <option value="hr">HR</option>
          <option value="final">Финальное</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Создать интервью
        </button>
      </div>
    </form>
  );
};

export default InterviewForm; 