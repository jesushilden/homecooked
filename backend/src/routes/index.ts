import { FastifyInstance } from 'fastify';
import { getHello } from '../controllers/hello-controller.js';
import { registerHandler, loginHandler, getProfileHandler } from '../controllers/user-controller.js';

export const routes = async (fastify: FastifyInstance) => {
  fastify.get('/', getHello);
  
  // User authentication routes
  fastify.post('/api/auth/register', registerHandler);
  fastify.post('/api/auth/login', loginHandler);
  fastify.get('/api/users/:userId', getProfileHandler);
};
