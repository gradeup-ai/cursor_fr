import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Interview {
  id: string;
  candidate_id: string;
  vacancy_id: string;
  position: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  created_at: string;
  candidate_name: string;
  recording_url?: string;
  transcript?: string;
  scheduled_at: string;
  duration: number;
}

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInterviewData {
  candidate_id: string;
  vacancy_id: string;
  scheduled_at: string;
  duration: number;
  interview_type: string;
  status: 'scheduled' | 'in_progress' | 'completed';
}

class InterviewService {
  private static instance: InterviewService;

  private constructor() {}

  public static getInstance(): InterviewService {
    if (!InterviewService.instance) {
      InterviewService.instance = new InterviewService();
    }
    return InterviewService.instance;
  }

  async getInterviews(): Promise<Interview[]> {
    const response = await axios.get(`${API_URL}/interviews`);
    return response.data;
  }

  async getInterview(id: string): Promise<Interview> {
    const response = await axios.get(`${API_URL}/interviews/${id}`);
    return response.data;
  }

  async getCandidate(id: string): Promise<Candidate> {
    const response = await axios.get(`${API_URL}/candidates/${id}`);
    return response.data;
  }

  async startInterview(id: string): Promise<Interview> {
    const response = await axios.post(`${API_URL}/interviews/${id}/start`);
    return response.data;
  }

  async endInterview(id: string): Promise<Interview> {
    const response = await axios.post(`${API_URL}/interviews/${id}/end`);
    return response.data;
  }

  async createInterview(data: CreateInterviewData): Promise<Interview> {
    const response = await axios.post(`${API_URL}/interviews`, data);
    return response.data;
  }

  async getInterviewsByVacancy(vacancyId: string): Promise<Interview[]> {
    const response = await axios.get(`${API_URL}/vacancies/${vacancyId}/interviews`);
    return response.data;
  }

  async deleteInterview(id: string): Promise<void> {
    await axios.delete(`${API_URL}/interviews/${id}`);
  }

  async completeInterview(id: string): Promise<Interview> {
    const response = await axios.post(`${API_URL}/interviews/${id}/complete`);
    return response.data;
  }
}

export default InterviewService.getInstance(); 