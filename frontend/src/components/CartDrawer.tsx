import { useCartStore } from '../store/cart.store';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { checkoutService } from '../services/checkout.service';

export function CartDrawer() {
  const { items, isDrawerOpen, toggleDrawer, updateQuantity, removeItem, clearCart } = useCartStore();
  const { getToken, isSignedIn } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!isSignedIn) {
      alert("Por favor inicia sesión para comprar.");
      return;
    }
    try {
      setIsCheckingOut(true);
      const token = await getToken();
      if (!token) throw new Error("No hay token de autenticación");
      
      // Asumiendo que el Store mapea .id pero aqui se llama ._id
      const payload = items.map(i => ({ 
        id: i._id || i.id, 
        quantity: i.quantity 
      }));

      const { session_url } = await checkoutService.createSession(payload as any, token);
      window.location.href = session_url;
    } catch (error: any) {
      alert(error.message || "Fallo preventivo al iniciar checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isDrawerOpen) return null;

  return createPortal(
    <>
      <div className="cart-backdrop" onClick={toggleDrawer} aria-hidden="true" />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>Tu Carrito</h2>
          <button className="cart-close-btn" onClick={toggleDrawer} aria-label="Cerrar carrito">
            &times;
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p className="cart-empty">El carrito está vacío.</p>
          ) : items.map((product) => (
            <div key={product._id} className="cart-item">
              <div className="cart-item-img">
                {product.image_urls && product.image_urls.length > 0 ? (
                   <img src={product.image_urls[0]} alt={product.name} />
                ) : (
                   <div className="img-placeholder">Sin foto</div>
                )}
              </div>

              <div className="cart-item-details">
                <div className="cart-item-row">
                  <h3>{product.name}</h3>
                  <p className="cart-item-price">${(product.price * product.quantity).toFixed(2)}</p>
                </div>
                <p className="cart-item-condition">Condición: {product.condition}</p>
                
                <div className="cart-item-actions">
                  <div className="cart-quantity-controls">
                     <button onClick={() => updateQuantity(product._id, product.quantity - 1)} disabled={product.quantity <= 1}>-</button>
                     <span>{product.quantity}</span>
                     <button onClick={() => updateQuantity(product._id, product.quantity + 1)} disabled={product.quantity >= product.stock}>+</button>
                     <span className="cart-stock-max">Stock: {product.stock}</span>
                  </div>

                  <button className="cart-remove-btn" onClick={() => removeItem(product._id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <p className="cart-taxes">Se calcularán impuestos y envíos al finalizar.</p>
            <div className="cart-footer-buttons">
              <button 
                className="btn-primary" 
                style={{ width: '100%', marginBottom: '10px' }}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                <span>{isCheckingOut ? 'Procesando...' : 'Ir a Pagar'}</span>
              </button>
              <button className="btn-outline" style={{ width: '100%' }} onClick={clearCart}>
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}