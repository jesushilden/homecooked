import { FastifyRequest, FastifyReply } from 'fastify';
import { register, login, getProfile, RegisterData, LoginData } from '../services/user-service.js';

export const registerHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userData = request.body as RegisterData;
    
    if (!userData.email || !userData.password || !userData.name) {
      return reply.status(400).send({ error: 'Email, password, and name are required' });
    }

    const user = await register(request.server.pg, userData);
    reply.status(201).send({ user });
  } catch (error) {
    if (error instanceof Error && error.message === 'User already exists with this email') {
      return reply.status(409).send({ error: error.message });
    }
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const loginData = request.body as LoginData;
    
    if (!loginData.email || !loginData.password) {
      return reply.status(400).send({ error: 'Email and password are required' });
    }

    const user = await login(request.server.pg, loginData);
    reply.send({ user });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid email or password') {
      return reply.status(401).send({ error: error.message });
    }
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getProfileHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { userId } = request.params as { userId: string };
    const user = await getProfile(request.server.pg, parseInt(userId));
    
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    reply.send({ user });
  } catch (error) {
    reply.status(500).send({ error: 'Internal server error' });
  }
};