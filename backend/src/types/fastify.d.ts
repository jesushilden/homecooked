import { JWTPayload } from '../models/user.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}