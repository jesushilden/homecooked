import { User, UserWithPasswordHash, CreateUserData } from '../models/user.js';
import pool from '../database.js';

export const createUser = async (userData: CreateUserData): Promise<User> => {
  const result = await pool.query<User>(
    'INSERT INTO users (email, password_hash, name, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, phone, address, created_at, updated_at',
    [userData.email, userData.password_hash, userData.name, userData.phone, userData.address],
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<UserWithPasswordHash | null> => {
  const result = await pool.query<UserWithPasswordHash>('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  return result.rows[0] || null;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query<User>(
    'SELECT id, email, name, phone, address, created_at, updated_at FROM users WHERE id = $1',
    [id],
  );
  return result.rows[0] || null;
};
