import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface SendEmailData {
  to: string;
  subject: string;
  body: string;
}

class EmailService {
  async sendEmail(data: SendEmailData): Promise<void> {
    await axios.post(`${API_URL}/email/send`, data);
  }
}

export default new EmailService(); 