import { createUser, getUserByEmail, getUserById } from '../repositories/user-repository.js';
import { User, RegisterData, LoginData } from '../models/user.js';
import { hashPassword, toUser, toCreateUserData } from '../utils/user.js';
import { FastifyInstance } from 'fastify';

export const register = async (
  pg: FastifyInstance['pg'],
  userData: RegisterData,
): Promise<User> => {
  const existingUser = await getUserByEmail(pg, userData.email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const createData = toCreateUserData(userData);
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
