import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  status: 'active' | 'closed';
  level: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVacancyData {
  title: string;
  description: string;
  requirements: string[];
}

export interface UpdateVacancyData extends Partial<CreateVacancyData> {
  status?: 'active' | 'closed';
}

class VacancyService {
  async getVacancies(): Promise<Vacancy[]> {
    const response = await axios.get(`${API_URL}/vacancies`);
    return response.data;
  }

  async getVacancy(id: string): Promise<Vacancy> {
    const response = await axios.get(`${API_URL}/vacancies/${id}`);
    return response.data;
  }

  async createVacancy(data: CreateVacancyData): Promise<Vacancy> {
    const response = await axios.post(`${API_URL}/vacancies`, data);
    return response.data;
  }

  async updateVacancy(id: string, data: Partial<CreateVacancyData>): Promise<Vacancy> {
    const response = await axios.put(`${API_URL}/vacancies/${id}`, data);
    return response.data;
  }

  async deleteVacancy(id: string): Promise<void> {
    await axios.delete(`${API_URL}/vacancies/${id}`);
  }
}

export default new VacancyService(); 