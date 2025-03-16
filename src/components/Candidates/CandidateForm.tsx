import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CandidateService, { CreateCandidateData } from '../../services/candidate.service';

interface CandidateFormProps {
  onSubmit?: (data: CreateCandidateData) => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CreateCandidateData>({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadCandidate = async () => {
      if (id) {
        try {
          const candidate = await CandidateService.getCandidate(id);
          setFormData({
            first_name: candidate.first_name,
            last_name: candidate.last_name,
            email: candidate.email
          });
        } catch {
          setError('Ошибка при загрузке данных кандидата');
        }
      }
    };

    loadCandidate();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        if (id) {
          await CandidateService.updateCandidate(id, formData);
        } else {
          await CandidateService.createCandidate(formData);
        }
        navigate('/candidates');
      }
    } catch {
      setError('Ошибка при сохранении данных');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
          Имя
        </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
          Фамилия
        </label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {id ? 'Обновить' : 'Создать'}
        </button>
      </div>
    </form>
  );
};

export default CandidateForm; 