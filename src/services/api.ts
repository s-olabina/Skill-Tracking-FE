import axios from 'axios';
import type {
  User,
  Skill,
  CreateSkillDto,
  UpdateSkillDto,
  SkillSummary,
  RegisterDto,
  LoginDto,
  AuthResponse,
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  updateProfile: async (data: User): Promise<User> => {
    const response = await api.put<User>('/auth/profile', data);
    return response.data;
  },
};

// Skills API
export const skillsApi = {
  getAllSkills: async (): Promise<Skill[]> => {
    const response = await api.get<Skill[]>('/skills');
    return response.data;
  },

  getSkillById: async (id: number): Promise<Skill> => {
    const response = await api.get<Skill>(`/skills/${id}`);
    return response.data;
  },

  createSkill: async (data: CreateSkillDto): Promise<Skill> => {
    const response = await api.post<Skill>('/skills', data);
    return response.data;
  },

  updateSkill: async (id: number, data: UpdateSkillDto): Promise<Skill> => {
    const response = await api.put<Skill>(`/skills/${id}`, data);
    return response.data;
  },

  deleteSkill: async (id: number): Promise<void> => {
    await api.delete(`/skills/${id}`);
  },

  getSkillSummary: async (): Promise<SkillSummary> => {
    const response = await api.get<SkillSummary>('/skills/summary');
    return response.data;
  },

  getSkillsByCategory: async (category: string): Promise<Skill[]> => {
    const response = await api.get<Skill[]>(`/skills/category/${category}`);
    return response.data;
  },

  getSkillsByLevel: async (level: number): Promise<Skill[]> => {
    const response = await api.get<Skill[]>(`/skills/level/${level}`);
    return response.data;
  },
};

export default api;
