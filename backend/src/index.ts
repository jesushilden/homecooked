import Fastify from 'fastify';

import routes from './routes/index.js';
import pgPlugin from './plugins/pg-plugin.js';
import errorHandler from './errors/error-handler.js';

const server = Fastify({
  logger: true,
});

server.register(errorHandler);
server.register(pgPlugin);
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
