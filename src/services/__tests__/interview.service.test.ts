import axios from 'axios';
import InterviewService from '../interview.service';

// Мокаем axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('InterviewService', () => {
  const mockInterview = {
    id: '1',
    candidate_id: '1',
    vacancy_id: '1',
    status: 'pending',
    created_at: '2024-01-01T00:00:00Z'
  };

  const mockCandidate = {
    id: '1',
    first_name: 'Иван',
    last_name: 'Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInterview', () => {
    it('должен получить интервью по ID', async () => {
      const mockResponse = {
        data: mockInterview
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await InterviewService.getInterview('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/interviews/1');
      expect(result).toEqual(mockInterview);
    });

    it('должен обработать ошибку при получении интервью', async () => {
      const error = new Error('Not found');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(InterviewService.getInterview('1')).rejects.toThrow('Not found');
    });
  });

  describe('getCandidate', () => {
    it('должен получить кандидата по ID', async () => {
      const mockResponse = {
        data: mockCandidate
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await InterviewService.getCandidate('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/candidates/1');
      expect(result).toEqual(mockCandidate);
    });

    it('должен обработать ошибку при получении кандидата', async () => {
      const error = new Error('Not found');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(InterviewService.getCandidate('1')).rejects.toThrow('Not found');
    });
  });

  describe('startInterview', () => {
    it('должен начать интервью', async () => {
      const mockResponse = {
        data: { ...mockInterview, status: 'in_progress' }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await InterviewService.startInterview('1');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/interviews/1/start'
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('должен обработать ошибку при начале интервью', async () => {
      const error = new Error('Failed to start interview');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(InterviewService.startInterview('1')).rejects.toThrow('Failed to start interview');
    });
  });

  describe('endInterview', () => {
    it('должен завершить интервью', async () => {
      const mockResponse = {
        data: { ...mockInterview, status: 'completed' }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await InterviewService.endInterview('1');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/interviews/1/end'
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('должен обработать ошибку при завершении интервью', async () => {
      const error = new Error('Failed to end interview');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(InterviewService.endInterview('1')).rejects.toThrow('Failed to end interview');
    });
  });

  describe('createInterview', () => {
    it('должно создать новое интервью', async () => {
      const interviewData = {
        candidate_id: '1',
        vacancy_id: '1',
        scheduled_at: '2024-03-20T10:00:00Z',
        duration: 60,
        interview_type: 'video',
        status: 'pending' as const
      };

      const mockResponse = {
        data: mockInterview
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await InterviewService.createInterview(interviewData);

      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8000/api/interviews', interviewData);
      expect(result).toEqual(mockInterview);
    });

    it('должно обработать ошибку при создании интервью', async () => {
      const interviewData = {
        candidate_id: '1',
        vacancy_id: '1',
        scheduled_at: '2024-03-20T10:00:00Z',
        duration: 60,
        interview_type: 'video',
        status: 'pending' as const
      };

      mockedAxios.post.mockRejectedValue(new Error('Validation error'));
      await expect(InterviewService.createInterview(interviewData)).rejects.toThrow('Validation error');
    });
  });

  describe('getInterviewsByVacancy', () => {
    it('должен получить список интервью по вакансии', async () => {
      const mockResponse = {
        data: [mockInterview]
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await InterviewService.getInterviewsByVacancy('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/vacancies/1/interviews');
      expect(result).toEqual([mockInterview]);
    });

    it('должен обработать ошибку при получении списка интервью', async () => {
      const error = new Error('Failed to fetch interviews');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(InterviewService.getInterviewsByVacancy('1')).rejects.toThrow('Failed to fetch interviews');
    });
  });
}); 