import { createUser, getUserByEmail, getUserById } from '../repositories/user-repository.js';
import { User, RegisterData, LoginData, CreateUserData } from '../models/user.js';
import { comparePassword, hashPassword } from '../utils/auth.js';
import { AppError } from '../errors/app-error.js';
import { FastifyInstance } from 'fastify';

export const register = async (
  pg: FastifyInstance['pg'],
  userData: RegisterData,
): Promise<User> => {
  const existingUser = await getUserByEmail(pg, userData.email);
  if (existingUser) {
    throw new AppError('User already exists with this email', 409);
  }

  const hashedPassword = await hashPassword(userData.password);
  const createData: CreateUserData = {
    email: userData.email,
    name: userData.name,
    phone: userData.phone,
    address: userData.address,
    password_hash: hashedPassword,
  };
  return await createUser(pg, createData);
};

export const login = async (pg: FastifyInstance['pg'], loginData: LoginData): Promise<User> => {
  const userWithPasswordHash = await getUserByEmail(pg, loginData.email);
  if (!userWithPasswordHash) {
    throw new AppError('Invalid email or password', 401);
  }

  const isValidPassword = await comparePassword(
    loginData.password,
    userWithPasswordHash.password_hash,
  );
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  const user: User = {
    id: userWithPasswordHash.id,
    email: userWithPasswordHash.email,
    name: userWithPasswordHash.name,
    phone: userWithPasswordHash.phone,
    address: userWithPasswordHash.address,
    created_at: userWithPasswordHash.created_at,
    updated_at: userWithPasswordHash.updated_at,
  };

  return user;
};

export const getProfile = async (pg: FastifyInstance['pg'], id: number): Promise<User | null> => {
  return await getUserById(pg, id);
};
