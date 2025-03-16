import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InterviewResultsList from '../InterviewResultsList';
import InterviewResultsService from '../../../services/interview-results.service';
import CandidateService from '../../../services/candidate.service';

jest.mock('../../../services/interview-results.service');
jest.mock('../../../services/candidate.service');

const mockResults = [
  {
    id: '1',
    interview_id: '1',
    candidate_id: '1',
    recording_url: 'url1',
    transcript: 'transcript1',
    duration: 60,
    created_at: '2024-01-01',
    status: 'pending',
    hr_notes: '',
    hr_rating: null,
    hr_decision: null
  },
  {
    id: '2',
    interview_id: '2',
    candidate_id: '2',
    recording_url: 'url2',
    transcript: 'transcript2',
    duration: 60,
    created_at: '2024-01-02',
    status: 'pending',
    hr_notes: '',
    hr_rating: 4,
    hr_decision: null
  }
];

const mockCandidates: Record<string, { id: string; first_name: string; last_name: string }> = {
  '1': { id: '1', first_name: 'Иван', last_name: 'Петров' },
  '2': { id: '2', first_name: 'Мария', last_name: 'Сидорова' }
};

const mockAnalytics = {
  total: 2,
  pending: 2,
  accepted: 0,
  rejected: 0,
  acceptance_rate: 0,
  rejection_rate: 0
};

describe('InterviewResultsList', () => {
  beforeEach(() => {
    (InterviewResultsService.getInterviewResults as jest.Mock).mockResolvedValue(mockResults);
    (InterviewResultsService.getInterviewAnalytics as jest.Mock).mockResolvedValue(mockAnalytics);
    (CandidateService.getCandidate as jest.Mock).mockImplementation((id) => Promise.resolve(mockCandidates[id]));
  });

  it('должен отобразить список результатов интервью', async () => {
    render(
      <BrowserRouter>
        <InterviewResultsList />
      </BrowserRouter>
    );

    // Проверяем состояние загрузки
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
    });

    // Проверяем отображение данных
    expect(screen.getByText('Иван Петров')).toBeInTheDocument();
    expect(screen.getByText('Мария Сидорова')).toBeInTheDocument();
  });

  it('должен фильтровать результаты по имени кандидата', async () => {
    render(
      <BrowserRouter>
        <InterviewResultsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Введите имя или фамилию');
    fireEvent.change(searchInput, { target: { value: 'Иван' } });

    expect(screen.getByText('Иван Петров')).toBeInTheDocument();
    expect(screen.queryByText('Мария Сидорова')).not.toBeInTheDocument();
  });

  it('должен фильтровать результаты по статусу', async () => {
    render(
      <BrowserRouter>
        <InterviewResultsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
    });

    const statusSelect = screen.getByLabelText('Статус');
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    expect(screen.getByText('Иван Петров')).toBeInTheDocument();
    expect(screen.getByText('Мария Сидорова')).toBeInTheDocument();
  });

  it('должен сортировать результаты по дате', async () => {
    render(
      <BrowserRouter>
        <InterviewResultsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
    });

    const sortSelect = screen.getByLabelText('Сортировка');
    fireEvent.change(sortSelect, { target: { value: 'date' } });

    const rows = screen.getAllByRole('row');
    // Пропускаем заголовок таблицы
    const firstDataRow = rows[1];
    expect(firstDataRow).toHaveTextContent('Мария Сидорова');
  });

  it('должен отобразить сообщение об ошибке при загрузке', async () => {
    (InterviewResultsService.getInterviewResults as jest.Mock).mockRejectedValue(new Error('Ошибка загрузки'));

    render(
      <BrowserRouter>
        <InterviewResultsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Ошибка загрузки данных')).toBeInTheDocument();
    });
  });
}); 