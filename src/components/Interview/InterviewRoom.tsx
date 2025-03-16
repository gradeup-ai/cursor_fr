import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LiveKitService from '../../services/livekit.service';
import VoiceService from '../../services/voice.service';

const InterviewRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const connectToRoom = async () => {
      if (!id) return;
      
      try {
        const token = await LiveKitService.getToken(id);
        const room = await LiveKitService.connectToRoom(token);
        setIsConnected(true);
        setParticipants(room.participants);
      } catch {
        setError('Ошибка при подключении к комнате');
      }
    };

    connectToRoom();
  }, [id]);

  const startRecording = async () => {
    if (!id) return;
    
    try {
      await LiveKitService.startRecording(id);
      setIsRecording(true);
      VoiceService.startSpeechRecognition((text: string) => {
        setTranscript(prev => prev + ' ' + text);
      });
    } catch {
      setError('Ошибка при начале записи');
    }
  };

  const stopRecording = async () => {
    if (!id) return;
    
    try {
      await LiveKitService.stopRecording(id);
      setIsRecording(false);
      VoiceService.stopSpeechRecognition();
    } catch {
      setError('Ошибка при остановке записи');
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-bold">Статус комнаты</h2>
        <p>Подключение: {isConnected ? 'Установлено' : 'Не установлено'}</p>
        <p>Запись: {isRecording ? 'Идет запись' : 'Запись не ведется'}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Участники ({participants.length})</h3>
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>{participant}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Транскрипция</h3>
        <div className="p-4 bg-gray-100 rounded min-h-[100px]">
          {transcript || 'Транскрипция появится здесь во время записи'}
        </div>
      </div>

      <div className="flex gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={!isConnected}
          >
            Начать запись
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Остановить запись
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewRoom; 