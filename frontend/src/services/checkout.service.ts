import type { CartItem } from '../types/cart';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const checkoutService = {
  createSession: async (items: CartItem[], token: string) => {
    const payload = {
      items: items.map(i => ({
        productId: i.id,
        quantity: i.quantity
      }))
    };

    const response = await fetch(`${BACKEND_URL}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    return response.json();
  }
};
