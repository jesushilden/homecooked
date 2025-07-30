import { FastifyRequest, FastifyReply } from 'fastify';
import { register, login, getProfile } from '../services/user-service.js';
import { LoginData, RegisterData } from '../models/user.js';
import { setAuthCookies, clearAuthCookies, verifyRefreshToken } from '../utils/auth.js';

export const registerHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userData = request.body as RegisterData;

    if (!userData.email || !userData.password || !userData.name) {
      return reply.status(400).send({ error: 'Email, password, and name are required' });
    }

    const user = await register(request.server.pg, userData);
    
    setAuthCookies(reply, user);
    
    reply.status(201).send({ user });
  } catch (error) {
    if (error instanceof Error && error.message === 'User already exists with this email') {
      return reply.status(409).send({ error: error.message });
    }
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const loginData = request.body as LoginData;

    if (!loginData.email || !loginData.password) {
      return reply.status(400).send({ error: 'Email and password are required' });
    }

    const user = await login(request.server.pg, loginData);
    
    setAuthCookies(reply, user);
    
    reply.send({ user });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid email or password') {
      return reply.status(401).send({ error: error.message });
    }
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getMeHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const user = await getProfile(request.server.pg, request.user.userId);
    
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    reply.send({ user });
  } catch {
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const logoutHandler = async (_request: FastifyRequest, reply: FastifyReply) => {
  clearAuthCookies(reply);
  reply.send({ message: 'Logged out successfully' });
};

export const refreshHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return reply.status(401).send({ error: 'Refresh token required' });
    }

    const payload = verifyRefreshToken(refreshToken);
    
    const user = await getProfile(request.server.pg, payload.userId);
    if (!user) {
      return reply.status(401).send({ error: 'User not found' });
    }

    setAuthCookies(reply, user);
    
    reply.send({ message: 'Tokens refreshed successfully' });
  } catch (err) {
    if (err instanceof Error && (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')) {
      clearAuthCookies(reply);
      return reply.status(401).send({ error: 'Invalid or expired refresh token' });
    }
    reply.status(500).send({ error: 'Internal server error' });
  }
};