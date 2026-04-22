import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cart.store';

export const ProductList: React.FC = () => {
  const { data: products, isLoading, isError, error } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  if (isLoading) {
    return <div style={{textAlign: 'center', marginTop: '4rem'}}>Cargando productos...</div>;
  }

  if (isError) {
    return <div style={{color: 'red', textAlign: 'center'}}>Error: {error?.message}</div>;
  }

  if (!products || products.length === 0) {
    return <div style={{textAlign: 'center', marginTop: '4rem'}}>No hay productos disponibles.</div>;
  }

  return (
    <div className="editorial-grid">
      {products.map((product) => (
        <article key={product._id} className="product-card stagger-1">
          <div className="product-image-container">
             <span className="product-badge">{product.condition}</span>
             <img 
               src={product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : `https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400&h=500&random=${product._id}`} 
               alt={product.name} 
               className="product-image" 
             />
          </div>
          <div className="product-info">
            <h3 className="product-title">{product.name}</h3>
            <div className="product-price">${product.price.toFixed(2)}</div>
            <p className="product-desc truncate">{product.description}</p>
            <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>Stock disponible: {product.stock}</p>
            <button 
              onClick={() => addItem(product)}
              className="btn-primary"
            >
              <span>Añadir al carrito</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};