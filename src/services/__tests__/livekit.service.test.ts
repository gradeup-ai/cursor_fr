import LiveKitService from '../livekit.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LiveKitService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getToken', () => {
    it('should return a room token', async () => {
      const mockToken = 'test-token';
      const mockResponse = { data: { token: mockToken } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await LiveKitService.getToken('test-room');
      expect(result).toBe(mockToken);
    });

    it('should handle errors', async () => {
      const error = new Error('Network Error');
      mockedAxios.post.mockRejectedValue(error);

      await expect(LiveKitService.getToken('test-room')).rejects.toThrow('Network Error');
    });
  });

  describe('connectToRoom', () => {
    it('должен подключиться к комнате', async () => {
      const mockResponse = {
        data: {
          id: 'room-1',
          name: 'interview-1',
          participants: []
        }
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const room = await LiveKitService.connectToRoom('valid-token');
      expect(room).toEqual({
        id: 'room-1',
        name: 'interview-1',
        participants: []
      });
    });

    it('должен обработать ошибку при подключении к комнате', async () => {
      const error = new Error('Network Error');
      mockedAxios.post.mockRejectedValue(error);
      
      await expect(LiveKitService.connectToRoom('invalid-token'))
        .rejects.toThrow('Failed to connect to room');
    });
  });

  describe('disconnectFromRoom', () => {
    it('должен отключиться от комнаты', async () => {
      const mockRoom = {
        name: 'interview-1',
        disconnect: jest.fn(),
        participants: []
      };

      await LiveKitService.disconnectFromRoom(mockRoom);

      expect(mockRoom.disconnect).toHaveBeenCalled();
    });
  });

  describe('startRecording', () => {
    it('должен начать запись', async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      await LiveKitService.startRecording('interview-1');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/livekit/recording/start/interview-1'),
        expect.any(Object)
      );
    });

    it('должен обработать ошибку при начале записи', async () => {
      const error = new Error('Network Error');
      mockedAxios.post.mockRejectedValue(error);
      
      await expect(LiveKitService.startRecording('interview-1'))
        .rejects.toThrow('Failed to start recording');
    });
  });

  describe('stopRecording', () => {
    it('должен остановить запись', async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      await LiveKitService.stopRecording('interview-1');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/livekit/recording/stop/interview-1'),
        expect.any(Object)
      );
    });

    it('должен обработать ошибку при остановке записи', async () => {
      const error = new Error('Network Error');
      mockedAxios.post.mockRejectedValue(error);
      
      await expect(LiveKitService.stopRecording('interview-1'))
        .rejects.toThrow('Failed to stop recording');
    });
  });
}); 