import Fastify from 'fastify';
import pg from '@fastify/postgres';
import { routes } from './routes/index.js';
import { errorHandler } from './errors/error-handler.js';

const server = Fastify({
  logger: true,
});

server.setErrorHandler(errorHandler);
server.register(pg, {
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/database',
});

server.register(routes);

const start = async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
