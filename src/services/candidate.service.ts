import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export type CandidateStatus = 'new' | 'interview_scheduled' | 'interviewed' | 'hired' | 'rejected';

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: CandidateStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateCandidateData {
  first_name: string;
  last_name: string;
  email: string;
}

export interface UpdateCandidateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: CandidateStatus;
}

class CandidateService {
  async getCandidates(): Promise<Candidate[]> {
    const response = await axios.get(`${API_URL}/candidates`);
    return response.data;
  }

  async getCandidate(id: string): Promise<Candidate> {
    const response = await axios.get(`${API_URL}/candidates/${id}`);
    return response.data;
  }

  async createCandidate(data: CreateCandidateData): Promise<Candidate> {
    const response = await axios.post(`${API_URL}/candidates`, data);
    return response.data;
  }

  async updateCandidate(id: string, data: UpdateCandidateData): Promise<Candidate> {
    const response = await axios.put(`${API_URL}/candidates/${id}`, data);
    return response.data;
  }

  async deleteCandidate(id: string): Promise<void> {
    await axios.delete(`${API_URL}/candidates/${id}`);
  }

  async getCandidatesByVacancy(vacancyId: string): Promise<Candidate[]> {
    const response = await axios.get(`${API_URL}/vacancies/${vacancyId}/candidates`);
    return response.data;
  }
}

export default new CandidateService(); 