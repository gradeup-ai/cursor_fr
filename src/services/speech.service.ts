export {}; // Делаем файл модулем

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

class SpeechService {
  private recognition: any = null;

  initialize(): void {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'ru-RU';
    }
  }

  startListening(onResult: (result: SpeechRecognitionResult) => void): void {
    if (!this.recognition) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1][0];
      onResult({
        transcript: result.transcript,
        confidence: result.confidence
      });
    };

    this.recognition.start();
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

export default new SpeechService(); 