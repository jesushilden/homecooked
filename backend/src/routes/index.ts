import { FastifyInstance } from 'fastify';
import { getHello } from '../controllers/hello-controller.js';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', getHello);
}
