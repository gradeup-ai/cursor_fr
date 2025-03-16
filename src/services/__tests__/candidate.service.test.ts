import axios from 'axios';
import CandidateService, { Candidate } from '../candidate.service';

// Мокаем axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CandidateService', () => {
  const mockCandidate: Candidate = {
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

  describe('getCandidates', () => {
    it('должен получить список всех кандидатов', async () => {
      const mockResponse = {
        data: [mockCandidate]
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await CandidateService.getCandidates();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/candidates');
      expect(result).toEqual([mockCandidate]);
    });

    it('должен обработать ошибку при получении списка кандидатов', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(CandidateService.getCandidates()).rejects.toThrow('Network error');
    });
  });

  describe('getCandidate', () => {
    it('должен получить кандидата по ID', async () => {
      const mockResponse = {
        data: mockCandidate
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await CandidateService.getCandidate('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/candidates/1');
      expect(result).toEqual(mockCandidate);
    });

    it('должен обработать ошибку при получении кандидата', async () => {
      const error = new Error('Not found');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(CandidateService.getCandidate('1')).rejects.toThrow('Not found');
    });
  });

  describe('createCandidate', () => {
    it('должен создать нового кандидата', async () => {
      const newCandidate = {
        first_name: 'Иван',
        last_name: 'Петров',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67'
      };
      const mockResponse = {
        data: mockCandidate
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await CandidateService.createCandidate(newCandidate);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/candidates',
        newCandidate
      );
      expect(result).toEqual(mockCandidate);
    });

    it('должен обработать ошибку при создании кандидата', async () => {
      const error = new Error('Validation error');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(CandidateService.createCandidate({
        first_name: 'Иван',
        last_name: 'Петров',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67'
      })).rejects.toThrow('Validation error');
    });
  });

  describe('updateCandidate', () => {
    it('должен обновить данные кандидата', async () => {
      const updateData = {
        first_name: 'Иван',
        last_name: 'Сидоров'
      };
      const mockResponse = {
        data: { ...mockCandidate, ...updateData }
      };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      const result = await CandidateService.updateCandidate('1', updateData);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        'http://localhost:8000/api/candidates/1',
        updateData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('должен обработать ошибку при обновлении кандидата', async () => {
      const error = new Error('Update failed');
      mockedAxios.patch.mockRejectedValueOnce(error);

      await expect(CandidateService.updateCandidate('1', {
        first_name: 'Иван'
      })).rejects.toThrow('Update failed');
    });
  });

  describe('deleteCandidate', () => {
    it('должен удалить кандидата', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await CandidateService.deleteCandidate('1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:8000/api/candidates/1');
    });

    it('должен обработать ошибку при удалении кандидата', async () => {
      const error = new Error('Delete failed');
      mockedAxios.delete.mockRejectedValueOnce(error);

      await expect(CandidateService.deleteCandidate('1')).rejects.toThrow('Delete failed');
    });
  });

  describe('getCandidatesByVacancy', () => {
    it('должен получить список кандидатов по вакансии', async () => {
      const mockResponse = {
        data: [mockCandidate]
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await CandidateService.getCandidatesByVacancy('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/vacancies/1/candidates');
      expect(result).toEqual([mockCandidate]);
    });

    it('должен обработать ошибку при получении кандидатов по вакансии', async () => {
      const error = new Error('Failed to fetch candidates');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(CandidateService.getCandidatesByVacancy('1')).rejects.toThrow('Failed to fetch candidates');
    });
  });
}); 