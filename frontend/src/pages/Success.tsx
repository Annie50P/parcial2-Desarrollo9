import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useCartStore } from '../store/cart.store';
import { ordersService } from '../services/orders.service';
import type { Order } from '../types/order';

interface OrderItem {
  product: { name: string; image_urls?: string[]; price: number };
  quantity: number;
  price: number;
}

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { getToken } = useAuth();
  const clearCart = useCartStore(state => state.clearCart);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) { setLoading(false); return; }
      try {
        const token = await getToken();
        if (!token) throw new Error('Unauthenticated');
        
        await ordersService.confirmPayment(sessionId, token);
        
        const orderData = await ordersService.getOrderBySession(sessionId, token);
        setOrder(orderData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar detalles');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [sessionId, getToken]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-6">
      <div className="page-container" style={{ maxWidth: 640 }}>
        <div className="card animate-slide-up" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✓</div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--success)' }}>¡Pago Exitoso!</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Tu pedido ha sido procesado correctamente.</p>
          </div>

          {loading && <div className="loading">Cargando detalles...</div>}

          {error && <div className="alert alert-error">{error}</div>}

          {order && (
            <div style={{ border: '2px solid var(--border)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '2px solid var(--border)', background: 'var(--bg-muted)' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)' }}>Fecha</p>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 600 }}>{formatDate(order.createdAt as unknown as string)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)' }}>Total</p>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600 }}>${order.total_amount?.toFixed(2)}</p>
                </div>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Productos
                </p>
                {(order.items as unknown as OrderItem[]).map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', border: '2px solid var(--border)', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: 60, height: 60, flexShrink: 0, border: '2px solid var(--border)', overflow: 'hidden' }}>
                      {item.product?.image_urls?.[0] ? (
                        <img src={item.product.image_urls[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sin</div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, marginBottom: '2px' }}>{item.product?.name}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cantidad: {item.quantity}</p>
                    </div>
                    <p style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/orders" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
              Ver mis pedidos
            </Link>
            <Link to="/home" className="btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}