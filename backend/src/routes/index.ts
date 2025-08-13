import { FastifyInstance } from 'fastify';
import {
  registerHandler,
  loginHandler,
  getMeHandler,
  logoutHandler,
  refreshHandler,
} from '../controllers/auth-controller.js';
import {
  createMealHandler,
  getMealHandler,
  getMyMealsHandler,
  getMealsHandler,
  updateMealHandler,
  deleteMealHandler,
} from '../controllers/meal-controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { RegisterDataSchema, LoginDataSchema } from '../models/user.js';
import { CreateMealDataSchema, UpdateMealDataSchema, MealIdParamsSchema } from '../models/meal.js';

export const routes = async (fastify: FastifyInstance) => {
  // User authentication routes
  fastify.post(
    '/api/auth/register',
    {
      schema: {
        body: RegisterDataSchema,
      },
    },
    registerHandler,
  );
  fastify.post(
    '/api/auth/login',
    {
      schema: {
        body: LoginDataSchema,
      },
    },
    loginHandler,
  );
  fastify.get('/api/auth/me', { preHandler: authMiddleware }, getMeHandler);
  fastify.post('/api/auth/logout', logoutHandler);
  fastify.post('/api/auth/refresh', refreshHandler);

  // Meal routes
  fastify.post(
    '/api/meals',
    {
      preHandler: authMiddleware,
      schema: {
        body: CreateMealDataSchema,
      },
    },
    createMealHandler,
  );
  fastify.get('/api/meals', getMealsHandler);
  fastify.get('/api/meals/my', { preHandler: authMiddleware }, getMyMealsHandler);
  fastify.get(
    '/api/meals/:id',
    {
      schema: {
        params: MealIdParamsSchema,
      },
    },
    getMealHandler,
  );
  fastify.put(
    '/api/meals/:id',
    {
      preHandler: authMiddleware,
      schema: {
        params: MealIdParamsSchema,
        body: UpdateMealDataSchema,
      },
    },
    updateMealHandler,
  );
  fastify.delete(
    '/api/meals/:id',
    {
      preHandler: authMiddleware,
      schema: {
        params: MealIdParamsSchema,
      },
    },
    deleteMealHandler,
  );
};
