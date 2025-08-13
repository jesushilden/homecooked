import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createMealListing,
  getMeal,
  getChefMeals,
  getAvailableMeals,
  updateMealListing,
  deleteMealListing,
} from '../services/meal-service.js';
import { CreateMealData, UpdateMealData } from '../models/meal.js';
import { AppError } from '../errors/app-error.js';

export const createMealHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user) {
    throw new AppError('Unauthorized', 401);
  }

  const mealData = request.body as Omit<CreateMealData, 'chef_id'>;

  if (
    !mealData.title ||
    !mealData.price_per_portion ||
    !mealData.total_portions ||
    !mealData.pickup_time_start ||
    !mealData.pickup_time_end ||
    !mealData.pickup_location
  ) {
    throw new AppError(
      'Title, price per portion, total portions, pickup times, and pickup location are required',
      400,
    );
  }

  const createData: CreateMealData = {
    ...mealData,
    chef_id: request.user.userId,
    pickup_time_start: new Date(mealData.pickup_time_start),
    pickup_time_end: new Date(mealData.pickup_time_end),
    order_time_start: mealData.order_time_start ? new Date(mealData.order_time_start) : undefined,
    order_time_end: mealData.order_time_end ? new Date(mealData.order_time_end) : undefined,
  };

  const meal = await createMealListing(createData);

  reply.status(201).send({ meal });
};

export const getMealHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id || isNaN(Number(id))) {
    throw new AppError('Invalid meal ID', 400);
  }

  const meal = await getMeal(Number(id));

  if (!meal) {
    throw new AppError('Meal not found', 404);
  }

  reply.send({ meal });
};

export const getMyMealsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user) {
    throw new AppError('Unauthorized', 401);
  }

  const meals = await getChefMeals(request.user.userId);

  reply.send({ meals });
};

export const getMealsHandler = async (_request: FastifyRequest, reply: FastifyReply) => {
  const meals = await getAvailableMeals();

  reply.send({ meals });
};

export const updateMealHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { id } = request.params as { id: string };

  if (!id || isNaN(Number(id))) {
    throw new AppError('Invalid meal ID', 400);
  }

  const updateData = request.body as UpdateMealData;

  if (updateData.pickup_time_start) {
    updateData.pickup_time_start = new Date(updateData.pickup_time_start);
  }
  if (updateData.pickup_time_end) {
    updateData.pickup_time_end = new Date(updateData.pickup_time_end);
  }
  if (updateData.order_time_start) {
    updateData.order_time_start = new Date(updateData.order_time_start);
  }
  if (updateData.order_time_end) {
    updateData.order_time_end = new Date(updateData.order_time_end);
  }

  const meal = await updateMealListing(Number(id), request.user.userId, updateData);

  reply.send({ meal });
};

export const deleteMealHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { id } = request.params as { id: string };

  if (!id || isNaN(Number(id))) {
    throw new AppError('Invalid meal ID', 400);
  }

  await deleteMealListing(Number(id), request.user.userId);

  reply.status(204).send();
};
