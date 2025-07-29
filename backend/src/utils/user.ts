import { createHash } from 'crypto';
import { User, UserWithPasswordHash, CreateUserData, RegisterData } from '../models/user.js';

export const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex');
};

export const toUser = (userWithPassword: UserWithPasswordHash): User => {
  return {
    id: userWithPassword.id,
    email: userWithPassword.email,
    name: userWithPassword.name,
    phone: userWithPassword.phone,
    address: userWithPassword.address,
    created_at: userWithPassword.created_at,
    updated_at: userWithPassword.updated_at,
  };
};

export const toCreateUserData = (registerData: RegisterData): CreateUserData => {
  return {
    email: registerData.email,
    name: registerData.name,
    phone: registerData.phone,
    address: registerData.address,
    password_hash: hashPassword(registerData.password),
  };
};
