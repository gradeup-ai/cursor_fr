import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VacancyService, { Vacancy } from '../../services/vacancy.service';

const VacancyList: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVacancies = async () => {
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

    fetchVacancies();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту вакансию?')) {
      try {
        await VacancyService.deleteVacancy(id);
        setVacancies(vacancies.filter(v => v.id !== id));
      } catch (err) {
        setError('Ошибка при удалении вакансии');
        console.error(err);
      }
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
        <h1 className="text-3xl font-bold text-gray-900">Вакансии</h1>
        <Link
          to="/vacancies/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Создать вакансию
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {vacancies.map((vacancy) => (
            <li key={vacancy.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {vacancy.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {vacancy.description}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-4">
                    <Link
                      to={`/vacancies/${vacancy.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(vacancy.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {vacancy.status === 'active' ? 'Активная' : 'Закрыта'}
                    </span>
                    <span className="ml-2">{vacancy.level}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Создана {new Date(vacancy.created_at).toLocaleDateString()}
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

export default VacancyList; 