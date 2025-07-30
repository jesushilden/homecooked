export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserWithPasswordHash extends User {
  password_hash: string;
}

export interface CreateUserData {
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
}
