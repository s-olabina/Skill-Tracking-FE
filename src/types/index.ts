export enum SkillLevel {
  Beginner = 1,
  Intermediate = 2,
  Expert = 3,
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  emailNotificationsEnabled: boolean;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  description?: string;
  level: SkillLevel;
  levelName: string;
  createdAt: string;
  lastUpdated: string;
}

export interface CreateSkillDto {
  name: string;
  category: string;
  description?: string;
  level: SkillLevel;
}

export interface UpdateSkillDto {
  name?: string;
  category?: string;
  description?: string;
  level?: SkillLevel;
}

export interface SkillSummary {
  totalSkills: number;
  byCategory: Record<string, number>;
  byLevel: Record<string, number>;
  recentlyUpdated: Skill[];
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
