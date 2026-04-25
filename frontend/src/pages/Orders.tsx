import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';

const statusLabel: Record<string, string> = {
  paid:      'Pagado',
  pending:   'Pendiente',
  failed:    'Fallido',
  cancelled: 'Cancelado',
};

const isWithin90Days = (dateString?: string) => {
  if (!dateString) return false;
  return Date.now() - new Date(dateString).getTime() <= 90 * 24 * 60 * 60 * 1000;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const formatPrice = (amount?: number) => {
  if (amount === undefined || amount === null) return '—';
  return `$${amount.toFixed(2)}`;
};

const OrdersSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    {[1, 2].map((i) => (
      <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
          {[100, 80, 80].map((w, j) => (
            <Skeleton key={j} variant="text" style={{ width: w, height: 14 }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Skeleton style={{ width: 60, height: 60, borderRadius: 4 }} />
          <div style={{ flex: 1 }}>
            <Skeleton variant="text" style={{ width: '60%', marginBottom: 8 }} />
            <Skeleton variant="text" style={{ width: '30%' }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const OrderCard: React.FC<{
  order: {
    _id: string;
    createdAt?: string;
    status: string;
    total_amount?: number;
    items: { quantity: number; price: number; product?: { name?: string; image_urls?: string[] } }[];
  };
}> = ({ order }) => {
  const [expanded, setExpanded] = React.useState(false);
  const canWarranty = order.status === 'paid' && isWithin90Days(order.createdAt);
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      style={{
        background: 'var(--white)',
        border: '1px solid var(--line)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}
      className="order-card-wrapper"
    >
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--line)',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
          <div>
            <p style={{ fontSize: '0.65rem', color: 'var(--gray)', marginBottom: 2, fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}>FECHA</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', color: 'var(--gray)', marginBottom: 2, fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}>TOTAL</p>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>{formatPrice(order.total_amount)}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', color: 'var(--gray)', marginBottom: 2, fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}>ESTADO</p>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
              background: order.status === 'paid' ? 'var(--ink)' : order.status === 'pending' ? 'var(--ink2)' : 'var(--line)',
              color: order.status === 'paid' || order.status === 'pending' ? 'var(--white)' : 'var(--ink2)',
              borderRadius: '2px',
            }}>
              {statusLabel[order.status] || order.status}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {canWarranty && (
            <Link
              to={`/warranties/new?orderId=${order._id}`}
              style={{
                padding: '8px 16px',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.3px',
                background: 'transparent',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Garantía
            </Link>
          )}
          {order.status === 'paid' && !canWarranty && (
            <span style={{ fontSize: '0.7rem', color: 'var(--gray)', fontFamily: 'var(--font-sans)' }}>Garantía expirada</span>
          )}
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease',
              color: 'var(--gray)',
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Items */}
      {expanded && (
        <div style={{ padding: '1.25rem 1.5rem', animation: 'fadeIn 0.2s ease' }}>
          <p style={{
            fontSize: '0.65rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--gray)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-sans)',
          }}>
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  background: 'var(--cream)',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  {item.product?.image_urls?.[0] ? (
                    <img src={item.product.image_urls[0]} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--line)', fontSize: '1.25rem' }}>—</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--ink)', marginBottom: 4, fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>
                    {item.product?.name || 'Producto'}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray)', fontFamily: 'var(--font-sans)' }}>
                    ×{item.quantity} · {formatPrice(item.price)}
                  </p>
                </div>
                <p style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--line)',
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink2)', fontFamily: 'var(--font-sans)' }}>Total del pedido</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 300, color: 'var(--ink)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const Orders: React.FC = () => {
  const { data: orders, isLoading, isError } = useOrders();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div className="page-container">

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{
            fontSize: '0.65rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: 'var(--gray)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-sans)',
          }}>
            Tu cuenta
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 300,
            color: 'var(--ink)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
          }}>
            Mis Pedidos
          </h1>
          {orders && orders.length > 0 && (
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--ink2)',
              marginTop: '0.5rem',
              fontFamily: 'var(--font-sans)',
            }}>
              {orders.length} {orders.length === 1 ? 'pedido realizado' : 'pedidos realizados'}
            </p>
          )}
        </div>

        {isLoading && <OrdersSkeleton />}

        {isError && (
          <EmptyState
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            }
            title="Error al cargar"
            description="No se pudieron cargar tus pedidos. Intenta de nuevo."
          />
        )}

        {!isLoading && !isError && (!orders || orders.length === 0) && (
          <EmptyState
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            }
            title="Sin pedidos aún"
            description="Cuando realices una compra, aparecerá aquí con todos los detalles."
            cta={
              <Link to="/home" style={{
                padding: '12px 24px',
                background: 'var(--ink)',
                color: 'var(--white)',
                fontSize: '0.8rem',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.25s ease',
              }}>
                Ir a la tienda
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            }
          />
        )}

        {!isLoading && !isError && orders && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;