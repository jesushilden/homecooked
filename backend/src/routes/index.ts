import { FastifyInstance } from 'fastify';
import {
  registerHandler,
  loginHandler,
  getMeHandler,
  logoutHandler,
  refreshHandler,
} from '../controllers/auth-controller.js';
import { authMiddleware } from '../middleware/auth.js';

export const routes = async (fastify: FastifyInstance) => {
  // User authentication routes
  fastify.post('/api/auth/register', registerHandler);
  fastify.post('/api/auth/login', loginHandler);
  fastify.get('/api/auth/me', { preHandler: authMiddleware }, getMeHandler);
  fastify.post('/api/auth/logout', logoutHandler);
  fastify.post('/api/auth/refresh', refreshHandler);
};
