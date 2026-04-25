import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
  paid:      'success',
  pending:   'warning',
  failed:    'error',
  cancelled: 'neutral',
};

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

const OrdersSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
    {[1, 2, 3].map((i) => (
      <div key={i} style={{ background: 'var(--white)', border: '0.5px solid var(--line)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '0.5px solid var(--line)', display: 'flex', gap: '2rem' }}>
          {[100, 80, 60, 100].map((w, j) => (
            <Skeleton key={j} variant="text" style={{ width: w, height: 14 }} />
          ))}
        </div>
        <div style={{ padding: '1.125rem' }}>
          <Skeleton variant="text" style={{ width: 120, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Skeleton style={{ width: 68, height: 68, borderRadius: 6 }} />
            <div style={{ flex: 1 }}>
              <Skeleton variant="text" style={{ width: '60%', marginBottom: 8 }} />
              <Skeleton variant="text" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Orders: React.FC = () => {
  const { data: orders, isLoading, isError } = useOrders();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: '3rem 0' }}>
      <div className="page-container">

        <PageHeader
          title="Mis Pedidos"
          subtitle={
            orders && orders.length > 0
              ? `${orders.length} ${orders.length === 1 ? 'pedido realizado' : 'pedidos realizados'}`
              : undefined
          }
        />

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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            }
            title="Sin pedidos aún"
            description="Cuando realices una compra, aparecerá aquí con todos los detalles."
            cta={
              <Link to="/home" className="btn-primary" style={{ textDecoration: 'none' }}>
                Ir a la tienda
              </Link>
            }
          />
        )}

        {!isLoading && !isError && orders && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => {
              const canWarranty = order.status === 'paid' && isWithin90Days(order.createdAt);
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <article key={order._id} className="order-card animate-fade-in">

                  {/* Order header */}
                  <div className="order-header">
                    <div className="order-header-item">
                      <span className="order-header-label">Fecha</span>
                      <span className="order-header-value">{formatDate(order.createdAt)}</span>
                    </div>

                    <div className="order-header-item">
                      <span className="order-header-label">Total</span>
                      <span className="order-header-value price">
                        ${order.total_amount?.toFixed(2) ?? '—'}
                      </span>
                    </div>

                    <div className="order-header-item">
                      <span className="order-header-label">Estado</span>
                      <Badge variant={statusVariant[order.status] ?? 'neutral'}>
                        {statusLabel[order.status] ?? order.status}
                      </Badge>
                    </div>

                    <div className="order-header-item" style={{ marginLeft: 'auto' }}>
                      {canWarranty ? (
                        <Link
                          to={`/warranties/new?orderId=${order._id}`}
                          className="btn-outline"
                          style={{ fontSize: '0.75rem', padding: '6px 14px', textDecoration: 'none' }}
                        >
                          Garantía
                        </Link>
                      ) : order.status === 'paid' ? (
                        <Badge variant="neutral">Garantía expirada</Badge>
                      ) : null}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="order-items">
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.62rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      color: 'var(--ink3)',
                      marginBottom: '0.875rem',
                    }}>
                      {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                      gap: '0.75rem',
                    }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-card">
                          <div className="order-item-image">
                            {item.product?.image_urls?.[0] ? (
                              <img src={item.product.image_urls[0]} alt={item.product?.name} />
                            ) : (
                              <div style={{
                                width: '100%', height: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.72rem', color: 'var(--ink3)',
                              }}>
                                —
                              </div>
                            )}
                          </div>
                          <div className="order-item-info">
                            <p className="order-item-name">
                              {item.product?.name || 'Producto'}
                            </p>
                            <div className="order-item-details">
                              <span>×{item.quantity}</span>
                              <span>${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="order-footer">
                    <div className="order-total">
                      <span className="order-total-label">Total del pedido</span>
                      <span className="order-total-value">
                        ${order.total_amount?.toFixed(2) ?? '—'}
                      </span>
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
