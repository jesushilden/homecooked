import { FastifyInstance } from 'fastify';

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

export interface CreateUserData {
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  address?: string;
}

export const createUser = async (
  pg: FastifyInstance['pg'],
  userData: CreateUserData,
): Promise<User> => {
  const result = await pg.query<User>(
    'INSERT INTO users (email, password_hash, name, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, phone, address, created_at, updated_at',
    [userData.email, userData.password_hash, userData.name, userData.phone, userData.address],
  );
  return result.rows[0];
};

export const getUserByEmail = async (
  pg: FastifyInstance['pg'],
  email: string,
): Promise<UserWithPasswordHash | null> => {
  const result = await pg.query<UserWithPasswordHash>('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  return result.rows[0] || null;
};

export const getUserById = async (pg: FastifyInstance['pg'], id: number): Promise<User | null> => {
  const result = await pg.query<User>(
    'SELECT id, email, name, phone, address, created_at, updated_at FROM users WHERE id = $1',
    [id],
  );
  return result.rows[0] || null;
};
