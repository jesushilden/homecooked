import { Static, Type } from '@sinclair/typebox';

export interface Meal {
  id: number;
  chef_id: number;
  title: string;
  description?: string;
  image_url?: string;
  price_per_portion: number;
  total_portions: number;
  pickup_time_start: Date;
  pickup_time_end: Date;
  order_time_start?: Date;
  order_time_end?: Date;
  pickup_location: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMealData {
  chef_id: number;
  title: string;
  description?: string;
  image_url?: string;
  price_per_portion: number;
  total_portions: number;
  pickup_time_start: Date;
  pickup_time_end: Date;
  order_time_start?: Date;
  order_time_end?: Date;
  pickup_location: string;
}

export const CreateMealDataSchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
  image_url: Type.Optional(Type.String({ format: 'uri' })),
  price_per_portion: Type.Number({ minimum: 0 }),
  total_portions: Type.Integer({ minimum: 1 }),
  pickup_time_start: Type.String({ format: 'date-time' }),
  pickup_time_end: Type.String({ format: 'date-time' }),
  order_time_start: Type.Optional(Type.String({ format: 'date-time' })),
  order_time_end: Type.Optional(Type.String({ format: 'date-time' })),
  pickup_location: Type.String({ minLength: 1 }),
});

export type CreateMealDataInput = Static<typeof CreateMealDataSchema>;

export const UpdateMealDataSchema = Type.Partial(CreateMealDataSchema);

export type UpdateMealDataInput = Static<typeof UpdateMealDataSchema>;

export interface UpdateMealData {
  title?: string;
  description?: string;
  image_url?: string;
  price_per_portion?: number;
  total_portions?: number;
  pickup_time_start?: Date;
  pickup_time_end?: Date;
  order_time_start?: Date;
  order_time_end?: Date;
  pickup_location?: string;
}

export const MealIdParamsSchema = Type.Object({
  id: Type.String({ pattern: '^\\d+$' }),
});

export type MealIdParams = Static<typeof MealIdParamsSchema>;
