import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import { routes } from './routes/index.js';
import { errorHandler } from './errors/error-handler.js';
import pool from './database.js';

const server = Fastify({
  logger: true,
});

server.setErrorHandler(errorHandler);
server.register(cookie);

server.register(routes);

const start = async () => {
  try {
    // Test the database connection
    await pool.query('SELECT 1');
    server.log.info('Database connection successful');

    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error('Failed to start server', err);
    console.error(err);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  server.log.info('Shutting down gracefully...');
  await server.close();
  await pool.end();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

start();
