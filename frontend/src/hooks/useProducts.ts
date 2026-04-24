import { useQuery } from '@tanstack/react-query';
import { productsService } from '../services/products.service';
import type { Product } from '../types/product';

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: () => productsService.getAll(),
  });
};