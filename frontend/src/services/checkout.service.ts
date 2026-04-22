import type { CartItem } from '../types/cart';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const checkoutService = {
  createSession: async (items: any[], token: string) => {
    // El CartDrawer ya envía productId directamente
    const payload = { items };
    

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
      console.error('[Checkout Error Full]:', errorData);
      console.error('[Checkout Error Stringified]:', JSON.stringify(errorData));
      
      let errorMsg = 'Checkout failed';
      if (typeof errorData.error === 'string') {
        errorMsg = errorData.error;
      } else if (Array.isArray(errorData.error)) {
        errorMsg = errorData.error.join(', ');
      } else if (errorData.error) {
        errorMsg = JSON.stringify(errorData.error);
      }
      
      throw new Error(errorMsg);
    }

    return response.json();
  }
};
