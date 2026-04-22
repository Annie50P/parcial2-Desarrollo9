import type { Product } from './product';

export interface OrderItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped';
  stripe_session_id?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
