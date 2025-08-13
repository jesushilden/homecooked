import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createMealListing,
  getMeal,
  getChefMeals,
  getAvailableMeals,
  updateMealListing,
  deleteMealListing,
} from '../services/meal-service.js';
import {
  CreateMealData,
  UpdateMealData,
  CreateMealDataInput,
  UpdateMealDataInput,
  MealIdParams,
} from '../models/meal.js';
import { AppError } from '../errors/app-error.js';

export const createMealHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user) {
    throw new AppError('Unauthorized', 401);
  }

  const mealData = request.body as CreateMealDataInput;

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
  const { id } = request.params as MealIdParams;

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

  const { id } = request.params as MealIdParams;
  const updateDataInput = request.body as UpdateMealDataInput;

  const updateData: UpdateMealData = {
    ...updateDataInput,
    pickup_time_start: updateDataInput.pickup_time_start
      ? new Date(updateDataInput.pickup_time_start)
      : undefined,
    pickup_time_end: updateDataInput.pickup_time_end
      ? new Date(updateDataInput.pickup_time_end)
      : undefined,
    order_time_start: updateDataInput.order_time_start
      ? new Date(updateDataInput.order_time_start)
      : undefined,
    order_time_end: updateDataInput.order_time_end
      ? new Date(updateDataInput.order_time_end)
      : undefined,
  };

  const meal = await updateMealListing(Number(id), request.user.userId, updateData);

  reply.send({ meal });
};

export const deleteMealHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { id } = request.params as MealIdParams;

  await deleteMealListing(Number(id), request.user.userId);

  reply.status(204).send();
};
