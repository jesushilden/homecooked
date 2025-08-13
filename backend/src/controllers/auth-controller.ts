import { FastifyRequest, FastifyReply } from 'fastify';
import { register, login, getProfile } from '../services/user-service.js';
import { LoginData, RegisterData } from '../models/user.js';
import { setAuthCookies, clearAuthCookies, verifyRefreshToken } from '../utils/auth.js';
import { AppError } from '../errors/app-error.js';

export const registerHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const userData = request.body as RegisterData;

  const user = await register(userData);

  setAuthCookies(reply, user);

  reply.status(201).send({ user });
};

export const loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const loginData = request.body as LoginData;

  const user = await login(loginData);

  setAuthCookies(reply, user);

  reply.send({ user });
};

export const getMeHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await getProfile(request.user.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  reply.send({ user });
};

export const logoutHandler = async (_request: FastifyRequest, reply: FastifyReply) => {
  clearAuthCookies(reply);
  reply.send({ message: 'Logged out successfully' });
};

export const refreshHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const refreshToken = request.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError('Refresh token required', 401);
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const user = await getProfile(payload.userId);
    if (!user) {
      throw new AppError('User not found', 401);
    }

    setAuthCookies(reply, user);

    reply.send({ message: 'Tokens refreshed successfully' });
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')
    ) {
      clearAuthCookies(reply);
      throw new AppError('Invalid or expired refresh token', 401);
    }
    throw err;
  }
};
