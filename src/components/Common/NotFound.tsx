import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-indigo-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Страница не найдена
          </h2>
          <p className="mt-2 text-base text-gray-500">
            Извините, мы не можем найти страницу, которую вы ищете.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="text-base font-medium text-indigo-600 hover:text-indigo-500"
            >
              Вернуться на главную
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 