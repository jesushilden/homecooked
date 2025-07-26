import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { FastifyError } from '@fastify/error';

export default function errorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    fastify.log.error(error);
    reply.status(error.statusCode || 500).send({
      error: error.name,
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  });
}
