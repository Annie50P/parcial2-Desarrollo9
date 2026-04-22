import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { ordersService } from '../services/orders.service';

export const useOrders = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      return ordersService.getMyOrders(token);
    },
  });
};
