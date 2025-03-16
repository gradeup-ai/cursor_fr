import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LiveKitService from '../../services/livekit.service';

const InterviewRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const connectToRoom = async () => {
      if (!id) return;
      
      try {
        const token = await LiveKitService.getToken(id);
        await LiveKitService.connectToRoom(token);
        setIsConnected(true);
      } catch {
        setError('Ошибка при подключении к комнате');
      }
    };

    connectToRoom();
  }, [id]);

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
      </div>
    </div>
  );
};

export default InterviewRoom; 