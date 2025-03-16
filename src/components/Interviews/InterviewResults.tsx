import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InterviewResultsService, { InterviewResult } from '../../services/interview-results.service';
import CandidateService, { Candidate } from '../../services/candidate.service';
import PDFService from '../../services/pdf.service';
import VacancyService from '../../services/vacancy.service';
import type { Vacancy } from '../../services/vacancy.service';

const InterviewResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [decision, setDecision] = useState<'accepted' | 'rejected' | ''>('');
  const [exporting, setExporting] = useState(false);
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;
        const resultData = await InterviewResultsService.getInterviewResult(id);
        setResult(resultData);
        setRating(resultData.hr_rating || 0);
        setDecision(resultData.status as 'accepted' | 'rejected' | '');
        setNotes(resultData.hr_notes || '');

        // Загружаем данные кандидата
        const candidateData = await CandidateService.getCandidate(resultData.candidate.id);
        setCandidate(candidateData);

        // Загружаем данные вакансии
        const vacancyData = await VacancyService.getVacancy(resultData.vacancy.id);
        setVacancy(vacancyData);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSave = async () => {
    try {
      if (!id || !result) return;

      await InterviewResultsService.updateInterviewResult(id, {
        hr_notes: notes,
        hr_rating: rating,
        status: decision || 'pending',
        hr_decision: decision
      });

      // Обновляем локальное состояние
      setResult({
        ...result,
        hr_notes: notes,
        hr_rating: rating,
        status: decision || 'pending',
        hr_decision: decision
      });
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
    }
  };

  const handleExportPDF = async () => {
    try {
      if (!result || !candidate || !vacancy) return;
      
      setExporting(true);
      const pdfBlob = await PDFService.generateInterviewReport({
        ...result,
        candidate: {
          id: result.candidate.id,
          email: candidate.email,
          firstName: candidate.first_name,
          lastName: candidate.last_name
        },
        vacancy: {
          id: result.vacancy.id,
          title: vacancy.title,
          description: vacancy.description
        }
      });
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `interview-report-${result.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Ошибка при экспорте PDF');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Ошибка загрузки данных
      </div>
    );
  }

  if (!result || !candidate || !vacancy) {
    return <div className="text-center py-12">Результаты интервью не найдены</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок и кнопки */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Результаты интервью
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                exporting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {exporting ? 'Экспорт...' : 'Экспорт в PDF'}
            </button>
          </div>
        </div>

        {/* Основная информация */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Информация об интервью</h2>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Длительность</dt>
                  <dd className="mt-1 text-sm text-gray-900">{Math.round(result.duration / 60)} минут</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Дата</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(result.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Статус</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      result.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      result.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.status === 'accepted' ? 'Принят' :
                       result.status === 'rejected' ? 'Отклонен' : 'На рассмотрении'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Запись и транскрипция */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Видео */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Запись интервью</h2>
            <video
              src={result.recording_url}
              controls
              className="w-full rounded-lg"
            />
          </div>

          {/* Транскрипция */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Транскрипция</h2>
            <div className="prose max-w-none">
              {result.transcript}
            </div>
          </div>
        </div>

        {/* Оценка и решение */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Оценка и решение</h2>
          <div className="space-y-6">
            {/* Заметки */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Заметки
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Оценка */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Оценка (1-5)
              </label>
              <div className="mt-2 flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className={`w-10 h-10 rounded-full ${
                      rating === value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            {/* Решение */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Решение
              </label>
              <div className="mt-2 flex space-x-4">
                <button
                  onClick={() => setDecision('accepted')}
                  className={`px-4 py-2 rounded-md ${
                    decision === 'accepted'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Принять
                </button>
                <button
                  onClick={() => setDecision('rejected')}
                  className={`px-4 py-2 rounded-md ${
                    decision === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Отклонить
                </button>
              </div>
            </div>

            {/* Кнопка сохранения */}
            <div>
              <button
                onClick={handleSave}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResults; 