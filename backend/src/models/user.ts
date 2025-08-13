import { Static, Type } from '@sinclair/typebox';

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

export const RegisterDataSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
  name: Type.String({ minLength: 1 }),
  phone: Type.Optional(Type.String()),
  address: Type.Optional(Type.String()),
});

export type RegisterData = Static<typeof RegisterDataSchema>;

export const LoginDataSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 1 }),
});

export type LoginData = Static<typeof LoginDataSchema>;

export interface JWTPayload {
  userId: number;
  email: string;
}
