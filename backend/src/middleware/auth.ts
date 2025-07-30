import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken, JWTPayload } from '../utils/auth.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const accessToken = request.cookies.accessToken;

    if (!accessToken) {
      return reply.status(401).send({ error: 'Access token required' });
    }

    const payload = verifyAccessToken(accessToken);
    request.user = payload;
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return reply.status(401).send({ error: 'Access token expired' });
    }
    return reply.status(401).send({ error: 'Invalid access token' });
  }
};