import { createHash } from 'crypto';
import {
  createUser,
  getUserByEmail,
  getUserById,
  User,
  CreateUserData,
  toUser,
} from '../repositories/user-repository.js';
import { FastifyInstance } from 'fastify';

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

const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex');
};

export const register = async (
  pg: FastifyInstance['pg'],
  userData: RegisterData,
): Promise<User> => {
  const existingUser = await getUserByEmail(pg, userData.email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const createData: CreateUserData = {
    email: userData.email,
    name: userData.name,
    phone: userData.phone,
    address: userData.address,
    password_hash: hashPassword(userData.password),
  };

  return await createUser(pg, createData);
};

export const login = async (pg: FastifyInstance['pg'], loginData: LoginData): Promise<User> => {
  const userWithPasswordHash = await getUserByEmail(pg, loginData.email);
  if (!userWithPasswordHash) {
    throw new Error('Invalid email or password');
  }

  const hashedPassword = hashPassword(loginData.password);
  if (userWithPasswordHash.password_hash !== hashedPassword) {
    throw new Error('Invalid email or password');
  }

  return toUser(userWithPasswordHash);
};

export const getProfile = async (pg: FastifyInstance['pg'], id: number): Promise<User | null> => {
  return await getUserById(pg, id);
};
