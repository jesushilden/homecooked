import { Meal, CreateMealData, UpdateMealData } from '../models/meal.js';
import pool from '../database.js';

export const createMeal = async (mealData: CreateMealData): Promise<Meal> => {
  const result = await pool.query<Meal>(
    `INSERT INTO meals (chef_id, title, description, image_url, price_per_portion, total_portions, 
     pickup_time_start, pickup_time_end, order_time_start, order_time_end, pickup_location) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
     RETURNING *`,
    [
      mealData.chef_id,
      mealData.title,
      mealData.description,
      mealData.image_url,
      mealData.price_per_portion,
      mealData.total_portions,
      mealData.pickup_time_start,
      mealData.pickup_time_end,
      mealData.order_time_start,
      mealData.order_time_end,
      mealData.pickup_location,
    ]
  );
  return result.rows[0];
};

export const getMealById = async (id: number): Promise<Meal | null> => {
  const result = await pool.query<Meal>('SELECT * FROM meals WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getMealsByChefId = async (chefId: number): Promise<Meal[]> => {
  const result = await pool.query<Meal>('SELECT * FROM meals WHERE chef_id = $1 ORDER BY pickup_time_start DESC', [chefId]);
  return result.rows;
};

export const getAllMeals = async (): Promise<Meal[]> => {
  const result = await pool.query<Meal>('SELECT * FROM meals ORDER BY pickup_time_start DESC');
  return result.rows;
};

export const updateMeal = async (id: number, mealData: UpdateMealData): Promise<Meal | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  Object.entries(mealData).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    const result = await pool.query<Meal>('SELECT * FROM meals WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  values.push(id);
  const query = `UPDATE meals SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  
  const result = await pool.query<Meal>(query, values);
  return result.rows[0] || null;
};

export const deleteMeal = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM meals WHERE id = $1', [id]);
  return result.rowCount !== null && result.rowCount > 0;
};