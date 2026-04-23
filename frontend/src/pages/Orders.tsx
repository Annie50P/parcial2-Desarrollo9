import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
  const { data: orders, isLoading, isError } = useOrders();

  const isWithin90Days = (dateString?: string) => {
    if (!dateString) return false;
    const orderDate = new Date(dateString).getTime();
    const ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;
    return Date.now() - orderDate <= ninetyDaysInMs;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <div className="loading animate-pulse">Cargando pedidos...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-6">
        <div className="error-state">
          <h3>Error al cargar pedidos</h3>
          <p>Hubo un problema. Intenta de nuevo.</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-6">
        <div className="empty-state" style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className="empty-state-icon">📦</div>
          <h3>Sin pedidos aún</h3>
          <p>Cuando realices una compra, aparecerán aquí.</p>
          <Link to="/home" className="btn-primary">
            Comenzar a comprar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-container">
        <div className="orders-header">
          <h1>Mis Pedidos</h1>
          <p>{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} realizados</p>
        </div>

        <div className="orders-list">
          {orders.map((order) => {
            const canRequestWarranty = isWithin90Days(order.createdAt);
            const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-header-item">
                    <span className="order-header-label">Fecha</span>
                    <span className="order-header-value">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-header-item">
                    <span className="order-header-label">Total</span>
                    <span className="order-header-value price">${order.total_amount?.toFixed(2)}</span>
                  </div>
                  <div className="order-header-item">
                    <span className="order-header-label">Estado</span>
                    <span className={`badge ${order.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-header-item" style={{ marginLeft: 'auto' }}>
                    {canRequestWarranty ? (
                      <Link to={`/warranties/new?orderId=${order._id}`} className="btn-primary">
                        Solicitar Garantía
                      </Link>
                    ) : (
                      <span className="badge badge-neutral">Garantía Expirada</span>
                    )}
                  </div>
                </div>

                <div className="order-items">
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                  </p>
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item-card">
                        <div className="order-item-image">
                          {item.product?.image_urls?.[0] ? (
                            <img src={item.product.image_urls[0]} alt={item.product.name} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sin img</div>
                          )}
                        </div>
                        <div className="order-item-info">
                          <p className="order-item-name">{item.product?.name || 'Producto'}</p>
                          <div className="order-item-details">
                            <span>Cant: {item.quantity}</span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;