type SpeechRecognitionCallback = (text: string) => void;

class VoiceService {
  private recognition: SpeechRecognition | null = null;

  startSpeechRecognition(onResult: SpeechRecognitionCallback): void {
    if (!('webkitSpeechRecognition' in window)) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'ru-RU';

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        onResult(result[0].transcript);
      }
    };

    this.recognition.start();
  }

  stopSpeechRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }
}

export default new VoiceService(); 