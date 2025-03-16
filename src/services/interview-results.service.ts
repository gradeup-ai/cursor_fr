import axios from 'axios';
import { Candidate, Vacancy } from '../types/interview';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface InterviewResult {
  id: string;
  interview_id: string;
  candidate_id: string;
  candidate: Candidate;
  vacancy: Vacancy;
  recording_url: string;
  transcript: string;
  summary: string;
  score: number;
  recommendation: string;
  duration: number;
  created_at: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  hr_notes?: string;
  hr_rating?: number;
  hr_decision?: string;
}

export interface InterviewAnalytics {
  total_interviews: number;
  average_duration: number;
  acceptance_rate: number;
  rejection_rate: number;
  pending_review: number;
}

class InterviewResultsService {
  async getInterviewResult(id: string): Promise<InterviewResult> {
    const response = await axios.get<InterviewResult>(`${API_URL}/interview-results/${id}`);
    return response.data;
  }

  async getInterviewResults(): Promise<InterviewResult[]> {
    const response = await axios.get<InterviewResult[]>(`${API_URL}/interview-results`);
    return response.data;
  }

  async getInterviewAnalytics(): Promise<InterviewAnalytics> {
    const response = await axios.get<InterviewAnalytics>(`${API_URL}/interview-results/analytics`);
    return response.data;
  }

  async updateInterviewResult(id: string, data: Partial<InterviewResult>): Promise<InterviewResult> {
    const response = await axios.patch<InterviewResult>(`${API_URL}/interview-results/${id}`, data);
    return response.data;
  }

  async getInterviewTranscript(id: string): Promise<string> {
    const response = await axios.get<{ transcript: string }>(`${API_URL}/interview-results/${id}/transcript`);
    return response.data.transcript;
  }

  async getInterviewRecording(id: string): Promise<string> {
    const response = await axios.get<{ recording_url: string }>(`${API_URL}/interview-results/${id}/recording`);
    return response.data.recording_url;
  }
}

export default new InterviewResultsService(); 