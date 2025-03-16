import axios from 'axios';
import InterviewResultsService from '../interview-results.service';

// Мокаем axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('InterviewResultsService', () => {
  const mockResult = {
    id: '1',
    interview_id: '1',
    candidate_id: '1',
    recording_url: 'http://example.com/recording.mp4',
    transcript: 'Текст транскрипции интервью',
    duration: 3600,
    created_at: '2024-01-01T00:00:00Z',
    status: 'accepted',
    hr_notes: 'Заметки HR',
    hr_rating: 5,
    hr_decision: 'accepted'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInterviewResult', () => {
    it('должен получить результат интервью по ID', async () => {
      const mockResponse = {
        data: mockResult
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await InterviewResultsService.getInterviewResult('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/interview-results/1');
      expect(result).toEqual(mockResult);
    });

    it('должен обработать ошибку при получении результата интервью', async () => {
      const error = new Error('Not found');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(InterviewResultsService.getInterviewResult('1')).rejects.toThrow('Not found');
    });
  });

  describe('getInterviewResults', () => {
    it('должен получить список всех результатов интервью', async () => {
      const mockResponse = {
        data: [mockResult]
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await InterviewResultsService.getInterviewResults();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/interview-results');
      expect(result).toEqual([mockResult]);
    });

    it('должен обработать ошибку при получении списка результатов', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(InterviewResultsService.getInterviewResults()).rejects.toThrow('Network error');
    });
  });

  describe('getInterviewAnalytics', () => {
    it('должен получить аналитику по интервью', async () => {
      const mockAnalytics = {
        total_interviews: 10,
        interviews_in_review: 3,
        acceptance_rate: 70
      };
      const mockResponse = {
        data: mockAnalytics
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await InterviewResultsService.getInterviewAnalytics();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/interview-results/analytics');
      expect(result).toEqual(mockAnalytics);
    });

    it('должен обработать ошибку при получении аналитики', async () => {
      const error = new Error('Failed to fetch analytics');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(InterviewResultsService.getInterviewAnalytics()).rejects.toThrow('Failed to fetch analytics');
    });
  });

  describe('updateInterviewResult', () => {
    it('должен обновить результат интервью', async () => {
      const updateData = {
        hr_notes: 'Новые заметки',
        hr_rating: 4,
        hr_decision: 'rejected'
      };
      const mockResponse = {
        data: { ...mockResult, ...updateData }
      };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      const result = await InterviewResultsService.updateInterviewResult('1', updateData);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        'http://localhost:8000/api/interview-results/1',
        updateData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('должен обработать ошибку при обновлении результата', async () => {
      const error = new Error('Update failed');
      mockedAxios.patch.mockRejectedValueOnce(error);

      await expect(InterviewResultsService.updateInterviewResult('1', {
        hr_notes: 'Новые заметки'
      })).rejects.toThrow('Update failed');
    });
  });

  describe('getInterviewTranscript', () => {
    it('должен получить транскрипцию интервью', async () => {
      const mockTranscript = {
        transcript: 'Текст транскрипции'
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockTranscript });

      const result = await InterviewResultsService.getInterviewTranscript('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/interview-results/1/transcript');
      expect(result).toEqual(mockTranscript.transcript);
    });

    it('должен обработать ошибку при получении транскрипции', async () => {
      const error = new Error('Transcript not found');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(InterviewResultsService.getInterviewTranscript('1')).rejects.toThrow('Transcript not found');
    });
  });

  describe('getInterviewRecording', () => {
    it('должен получить URL записи интервью', async () => {
      const mockRecording = {
        recording_url: 'http://example.com/recording.mp4'
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockRecording });

      const result = await InterviewResultsService.getInterviewRecording('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/interview-results/1/recording');
      expect(result).toEqual(mockRecording.recording_url);
    });

    it('должен обработать ошибку при получении записи', async () => {
      const error = new Error('Recording not found');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(InterviewResultsService.getInterviewRecording('1')).rejects.toThrow('Recording not found');
    });
  });
}); 