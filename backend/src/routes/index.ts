import { FastifyInstance } from 'fastify';
import { getHello } from '../controllers/hello-controller.js';

export const routes = async (fastify: FastifyInstance) => {
  fastify.get('/', getHello);
};
