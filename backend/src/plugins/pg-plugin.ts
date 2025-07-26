import pg from '@fastify/postgres';

export default async function (fastify: any, opts: any) {
  fastify.register(pg, {
    connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/database',
  });
};
