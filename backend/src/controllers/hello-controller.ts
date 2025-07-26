import { FastifyRequest, FastifyReply } from 'fastify';
import { getHelloMessage } from '../services/hello-service.js';

export const getHello = async (request: FastifyRequest, reply: FastifyReply) => {
  return getHelloMessage();
};
