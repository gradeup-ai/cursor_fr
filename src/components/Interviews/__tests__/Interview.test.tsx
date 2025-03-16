import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Interview from '../Interview';
import InterviewService from '../../../services/interview.service';
import type { Interview as InterviewType, Candidate as CandidateType } from '../../../services/interview.service';

jest.mock('../../../services/interview.service');

const mockInterview: InterviewType = {
  id: '1',
  candidate_id: '1',
  position: 'Software Developer',
  status: 'pending',
  created_at: '2024-03-14T12:00:00Z',
  candidate_name: 'John Doe'
};

const mockCandidate: CandidateType = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  created_at: '2024-03-20T10:00:00Z',
  updated_at: '2024-03-20T10:00:00Z'
};

describe('Interview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (InterviewService.getInterview as jest.Mock).mockResolvedValue(mockInterview);
  });

  const renderInterview = () => {
    return render(
      <MemoryRouter initialEntries={['/interview/1']}>
        <Routes>
          <Route path="/interviews/:id" element={<Interview />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders interview details', async () => {
    render(
      <MemoryRouter initialEntries={['/interview/1']}>
        <Interview />
      </MemoryRouter>
    );

    expect(await screen.findByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/pending/)).toBeInTheDocument();
  });

  it('должен загрузить и отобразить данные интервью', async () => {
    const mockedInterviewService = InterviewService as jest.Mocked<typeof InterviewService>;
    mockedInterviewService.getInterview.mockResolvedValueOnce(mockInterview);
    mockedInterviewService.getCandidate.mockResolvedValueOnce(mockCandidate);

    renderInterview();

    await waitFor(() => {
      expect(screen.getByText(`Интервью - ${mockCandidate.first_name} ${mockCandidate.last_name}`)).toBeInTheDocument();
    });
  });

  it('должен отобразить сообщение, если интервью не найдено', async () => {
    const mockedInterviewService = InterviewService as jest.Mocked<typeof InterviewService>;
    mockedInterviewService.getInterview.mockRejectedValueOnce(new Error('Interview not found'));

    renderInterview();

    await waitFor(() => {
      expect(screen.getByText('Интервью не найдено')).toBeInTheDocument();
    });
  });

  it('должен отобразить кнопку начала интервью для статуса pending', async () => {
    const mockedInterviewService = InterviewService as jest.Mocked<typeof InterviewService>;
    mockedInterviewService.getInterview.mockResolvedValueOnce(mockInterview);
    mockedInterviewService.getCandidate.mockResolvedValueOnce(mockCandidate);

    renderInterview();

    await waitFor(() => {
      expect(screen.getByText('Начать интервью')).toBeInTheDocument();
    });
  });

  it('должен отобразить кнопку завершения для статуса in_progress', async () => {
    const mockedInterviewService = InterviewService as jest.Mocked<typeof InterviewService>;
    mockedInterviewService.getInterview.mockResolvedValueOnce({
      ...mockInterview,
      status: 'in_progress' as const
    });
    mockedInterviewService.getCandidate.mockResolvedValueOnce(mockCandidate);

    renderInterview();

    await waitFor(() => {
      expect(screen.getByText('Завершить интервью')).toBeInTheDocument();
    });
  });

  it('должен отобразить сообщение о завершении для статуса completed', async () => {
    const mockedInterviewService = InterviewService as jest.Mocked<typeof InterviewService>;
    mockedInterviewService.getInterview.mockResolvedValueOnce({
      ...mockInterview,
      status: 'completed' as const
    });
    mockedInterviewService.getCandidate.mockResolvedValueOnce(mockCandidate);

    renderInterview();

    await waitFor(() => {
      expect(screen.getByText('Интервью завершено')).toBeInTheDocument();
    });
  });
});