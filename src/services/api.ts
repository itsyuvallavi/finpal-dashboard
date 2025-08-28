import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('finpal_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('finpal_token');
      localStorage.removeItem('finpal_user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  location?: string;
  paymentMethod?: string;
  recurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  monthlyContribution: number;
  status: 'on-track' | 'behind' | 'ahead' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  amount: number;
  description: string;
  category: string;
  date?: string;
  location?: string;
  paymentMethod?: string;
  recurring?: boolean;
}

export interface CreateGoalData {
  title: string;
  description?: string;
  targetAmount: number;
  targetDate: string;
  category: string;
  priority?: 'high' | 'medium' | 'low';
  monthlyContribution?: number;
}

// Auth API
export const authAPI = {
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', data);
    return response.data;
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const response: AxiosResponse<{ user: User }> = await api.get('/auth/me');
    return response.data;
  },
};

// Transactions API
export const transactionsAPI = {
  async getAll(): Promise<{ transactions: Transaction[] }> {
    const response: AxiosResponse<{ transactions: Transaction[] }> = await api.get('/api/transactions');
    return response.data;
  },

  async getById(id: string): Promise<{ transaction: Transaction }> {
    const response: AxiosResponse<{ transaction: Transaction }> = await api.get(`/api/transactions/${id}`);
    return response.data;
  },

  async create(data: CreateTransactionData): Promise<{ transaction: Transaction }> {
    const response: AxiosResponse<{ transaction: Transaction }> = await api.post('/api/transactions', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateTransactionData>): Promise<{ transaction: Transaction }> {
    const response: AxiosResponse<{ transaction: Transaction }> = await api.put(`/api/transactions/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/api/transactions/${id}`);
    return response.data;
  },
};

// Goals API
export const goalsAPI = {
  async getAll(): Promise<{ goals: Goal[] }> {
    const response: AxiosResponse<{ goals: Goal[] }> = await api.get('/api/goals');
    return response.data;
  },

  async getById(id: string): Promise<{ goal: Goal }> {
    const response: AxiosResponse<{ goal: Goal }> = await api.get(`/api/goals/${id}`);
    return response.data;
  },

  async create(data: CreateGoalData): Promise<{ goal: Goal }> {
    const response: AxiosResponse<{ goal: Goal }> = await api.post('/api/goals', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateGoalData & { currentAmount?: number; status?: string }>): Promise<{ goal: Goal }> {
    const response: AxiosResponse<{ goal: Goal }> = await api.put(`/api/goals/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/api/goals/${id}`);
    return response.data;
  },
};

export default api;