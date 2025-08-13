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
