import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useCartStore } from '../store/cart.store';
import { ordersService } from '../services/orders.service';
import type { Order } from '../types/order';

interface OrderItem {
  product: {
    name: string;
    image_urls?: string[];
    price: number;
  };
  quantity: number;
  price: number;
}

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { getToken } = useAuth();
  const clearCart = useCartStore(state => state.clearCart);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) return;

      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        if (!token) {
          setError('No autenticado');
          return;
        }
        const orderData = await ordersService.getOrderBySession(sessionId, token);
        setOrder(orderData);
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.error || err.message || 'Error al cargar los detalles');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId, getToken]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0] p-6">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 max-w-2xl w-full">
        <h1 className="text-4xl font-black mb-2 uppercase italic text-green-600 text-center">¡Pago Exitoso!</h1>
        <p className="mb-6 font-bold text-lg text-center">Tu orden ha sido procesada correctamente.</p>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando detalles del pedido...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-500 p-4 mb-6">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {order && (
          <div className="border-2 border-black p-4 mb-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-black">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Nro. de Orden</p>
                <p className="font-bold text-sm">{order._id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase text-gray-500">Fecha</p>
                <p className="font-bold text-sm">{formatDate(order.createdAt as unknown as string)}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Productos</p>
              <div className="space-y-3">
                {(order.items as unknown as OrderItem[]).map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 flex-shrink-0 overflow-hidden">
                      {item.product?.image_urls && item.product.image_urls.length > 0 ? (
                        <img
                          src={item.product.image_urls[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin img</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t-2 border-black">
              <p className="font-black uppercase text-lg">Total</p>
              <p className="font-black text-2xl">${order.total_amount?.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            to="/orders"
            className="block w-full bg-black text-white font-black py-3 px-6 hover:bg-white hover:text-black border-2 border-black transition-colors uppercase italic text-center"
          >
            Ver mis pedidos
          </Link>
          <Link
            to="/home"
            className="block w-full bg-white text-black font-black py-3 px-6 hover:bg-black hover:text-white border-2 border-black transition-colors uppercase italic text-center"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}