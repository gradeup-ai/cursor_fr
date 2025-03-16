import React, { useEffect, useState } from 'react';
import VacancyService, { Vacancy } from '../../services/vacancy.service';

const VacanciesList: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVacancy, setNewVacancy] = useState({
    title: '',
    description: '',
    requirements: ['']
  });

  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    try {
      const data = await VacancyService.getVacancies();
      setVacancies(data);
    } catch (err) {
      setError('Ошибка при загрузке вакансий');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequirement = () => {
    setNewVacancy(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    setNewVacancy(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await VacancyService.createVacancy(newVacancy);
      setShowAddForm(false);
      setNewVacancy({ title: '', description: '', requirements: [''] });
      await loadVacancies();
    } catch (err) {
      setError('Ошибка при создании вакансии');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Управление вакансиями</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showAddForm ? 'Отменить' : 'Добавить вакансию'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white shadow sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Название вакансии
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={newVacancy.title}
                    onChange={e => setNewVacancy(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Описание
                  </label>
                  <textarea
                    id="description"
                    required
                    value={newVacancy.description}
                    onChange={e => setNewVacancy(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Требования
                  </label>
                  {newVacancy.requirements.map((req, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={e => handleRequirementChange(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 mr-2"
                        placeholder="Введите требование"
                      />
                      {index === newVacancy.requirements.length - 1 && (
                        <button
                          type="button"
                          onClick={handleAddRequirement}
                          className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Создать вакансию
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {vacancies.map((vacancy) => (
            <li key={vacancy.id} className="px-4 py-4 sm:px-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{vacancy.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{vacancy.description}</p>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700">Требования:</h4>
                <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                  {vacancy.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VacanciesList; 