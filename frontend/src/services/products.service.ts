import type { Product } from '../types/product';

const API_URL = 'http://localhost:3000/api';

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const result = await response.json();
  return result.data || [];
};