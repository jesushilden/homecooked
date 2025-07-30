import { FastifyRequest } from 'fastify';
import { verifyAccessToken } from '../utils/auth.js';
import { AppError } from '../errors/app-error.js';

export const authMiddleware = async (request: FastifyRequest) => {
  const accessToken = request.cookies.accessToken;

  if (!accessToken) {
    throw new AppError('Access token required', 401);
  }

  try {
    const payload = verifyAccessToken(accessToken);
    request.user = payload;
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      throw new AppError('Access token expired', 401);
    }
    throw new AppError('Invalid access token', 401);
  }
};