import { useCartStore } from '../store/cart.store';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { checkoutService } from '../services/checkout.service';

export function CartDrawer() {
  const { items, isDrawerOpen, toggleDrawer, updateQuantity, removeItem, clearCart } = useCartStore();
  const { getToken, isSignedIn } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async () => {
    if (!isSignedIn) {
      alert('Por favor inicia sesión para comprar.');
      return;
    }
    try {
      setIsCheckingOut(true);
      const token = await getToken();
      if (!token) throw new Error('No hay token de autenticación');
      const payload = items.map((i) => ({ productId: i._id, quantity: i.quantity }));
      const { session_url } = await checkoutService.createSession(payload as any, token);
      window.location.href = session_url;
    } catch (error: any) {
      console.error('[Checkout Error]:', error);
      if (error.message?.includes('not found') || error.message?.includes('Invalid')) {
        localStorage.removeItem('safetech-cart-storage');
        window.location.reload();
      } else {
        alert(error.message || 'Error al iniciar el checkout.');
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isDrawerOpen) return null;

  return createPortal(
    <>
      <div className="cart-backdrop" onClick={toggleDrawer} aria-hidden="true" />

      <div className="cart-drawer" role="dialog" aria-label="Carrito de compras">

        {/* Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h2>Carrito</h2>
            {itemCount > 0 && (
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'var(--ink3)',
              }}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button className="cart-close-btn" onClick={toggleDrawer} aria-label="Cerrar carrito">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--line)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <p>El carrito está vacío.</p>
            </div>
          ) : (
            items.map((product) => (
              <div key={product._id} className="cart-item">
                <div className="cart-item-img">
                  {product.image_urls && product.image_urls.length > 0 ? (
                    <img src={product.image_urls[0]} alt={product.name} />
                  ) : (
                    <div className="img-placeholder">—</div>
                  )}
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-row">
                    <h3>{product.name}</h3>
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '0.95rem',
                      fontWeight: 400,
                      color: 'var(--ink)',
                    }}>
                      ${(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                  <p className="cart-item-condition">{product.condition}</p>

                  <div className="cart-item-actions">
                    <div className="cart-quantity-controls">
                      <button
                        onClick={() => updateQuantity(product._id, product.quantity - 1)}
                        disabled={product.quantity <= 1}
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product._id, product.quantity + 1)}
                        disabled={product.quantity >= product.stock}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                      {product.quantity >= product.stock && (
                        <span className="cart-stock-max">Máx.</span>
                      )}
                    </div>
                    <button className="cart-remove-btn" onClick={() => removeItem(product._id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <p className="cart-taxes">Impuestos y envío se calculan al finalizar.</p>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '0.825rem', marginBottom: '0.625rem' }}
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <span style={{ opacity: 0.7 }}>Procesando…</span>
              ) : (
                <>
                  Ir a pagar
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>

            <button
              className="btn-ghost"
              style={{ width: '100%', fontSize: '0.75rem', color: 'var(--ink3)' }}
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
