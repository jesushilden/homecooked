import {
  createMeal,
  getMealById,
  getMealsByChefId,
  getAllMeals,
  updateMeal,
  deleteMeal,
} from '../repositories/meal-repository.js';
import { Meal, CreateMealData, UpdateMealData } from '../models/meal.js';
import { AppError } from '../errors/app-error.js';

export const createMealListing = async (mealData: CreateMealData): Promise<Meal> => {
  if (mealData.pickup_time_start >= mealData.pickup_time_end) {
    throw new AppError('Pickup start time must be before pickup end time', 400);
  }

  if (
    mealData.order_time_start &&
    mealData.order_time_end &&
    mealData.order_time_start >= mealData.order_time_end
  ) {
    throw new AppError('Order start time must be before order end time', 400);
  }

  if (mealData.price_per_portion < 0) {
    throw new AppError('Price per portion must be greater than or equal to 0', 400);
  }

  if (mealData.total_portions <= 0) {
    throw new AppError('Total portions must be greater than 0', 400);
  }

  return await createMeal(mealData);
};

export const getMeal = async (id: number): Promise<Meal | null> => {
  return await getMealById(id);
};

export const getChefMeals = async (chefId: number): Promise<Meal[]> => {
  return await getMealsByChefId(chefId);
};

export const getAvailableMeals = async (): Promise<Meal[]> => {
  return await getAllMeals();
};

export const updateMealListing = async (
  id: number,
  chefId: number,
  updateData: UpdateMealData,
): Promise<Meal> => {
  const existingMeal = await getMealById(id);
  if (!existingMeal) {
    throw new AppError('Meal not found', 404);
  }

  if (existingMeal.chef_id !== chefId) {
    throw new AppError('You can only update your own meals', 403);
  }

  if (updateData.pickup_time_start && updateData.pickup_time_end) {
    if (updateData.pickup_time_start >= updateData.pickup_time_end) {
      throw new AppError('Pickup start time must be before pickup end time', 400);
    }
  }

  if (updateData.order_time_start && updateData.order_time_end) {
    if (updateData.order_time_start >= updateData.order_time_end) {
      throw new AppError('Order start time must be before order end time', 400);
    }
  }

  if (updateData.price_per_portion !== undefined && updateData.price_per_portion < 0) {
    throw new AppError('Price per portion must be greater than or equal to 0', 400);
  }

  if (updateData.total_portions !== undefined && updateData.total_portions <= 0) {
    throw new AppError('Total portions must be greater than 0', 400);
  }

  const updatedMeal = await updateMeal(id, updateData);
  if (!updatedMeal) {
    throw new AppError('Failed to update meal', 500);
  }

  return updatedMeal;
};

export const deleteMealListing = async (id: number, chefId: number): Promise<void> => {
  const existingMeal = await getMealById(id);
  if (!existingMeal) {
    throw new AppError('Meal not found', 404);
  }

  if (existingMeal.chef_id !== chefId) {
    throw new AppError('You can only delete your own meals', 403);
  }

  const deleted = await deleteMeal(id);
  if (!deleted) {
    throw new AppError('Failed to delete meal', 500);
  }
};
