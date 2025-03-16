export interface Candidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Vacancy {
  id: string;
  title: string;
  description: string;
}

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
  status: "reviewed" | "accepted" | "pending" | "rejected";
  hr_notes?: string;
  created_at: string;
} 