import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

class AuthService {
    async login(data: LoginData): Promise<void> {
        const response = await axios.post(`${API_URL}/auth/login`, data);
        localStorage.setItem('token', response.data.token);
    }

    async register(data: RegisterData): Promise<void> {
        const response = await axios.post(`${API_URL}/auth/register`, data);
        localStorage.setItem('token', response.data.token);
    }

    async logout(): Promise<void> {
        localStorage.removeItem('token');
    }

    async getCurrentUser(): Promise<User> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.get<User>(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            await this.getCurrentUser();
            return true;
        } catch {
            return false;
        }
    }
}

export default new AuthService(); 