const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Room {
  id: string;
  name: string;
  participants: string[];
}

export interface Token {
  token: string;
}

export interface Recording {
  id: string;
  roomId: string;
  startedAt: string;
  endedAt?: string;
  url?: string;
}

interface RawRecording {
  id: string;
  roomId: string;
  startedAt: string;
  endedAt?: string;
  url?: string;
}

interface ConnectResponse {
  id: string;
  name: string;
  participants: string[];
}

export class LiveKitService {
  async getToken(roomId: string): Promise<string> {
    const response = await fetch(`${API_URL}/livekit/token/${roomId}`);
    const data = await response.json();
    return data.token;
  }

  async connectToRoom(token: string): Promise<Room> {
    const response = await fetch(`${API_URL}/livekit/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to connect to room');
    }

    const data = await response.json() as ConnectResponse;
    return {
      id: data.id,
      name: data.name,
      participants: data.participants || []
    };
  }

  async startRecording(roomId: string): Promise<void> {
    const response = await fetch(`${API_URL}/livekit/recording/start/${roomId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to start recording');
    }
  }

  async stopRecording(roomId: string): Promise<void> {
    const response = await fetch(`${API_URL}/livekit/recording/stop/${roomId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to stop recording');
    }
  }

  async getRecordings(roomId: string): Promise<Recording[]> {
    const response = await fetch(`${API_URL}/livekit/recordings/${roomId}`);
    const data = await response.json();
    return data.map((item: RawRecording) => ({
      id: item.id,
      roomId: item.roomId,
      startedAt: item.startedAt,
      endedAt: item.endedAt,
      url: item.url
    }));
  }

  async disconnectFromRoom(room: { disconnect: () => void }): Promise<void> {
    await room.disconnect();
  }
}

export default new LiveKitService();

 