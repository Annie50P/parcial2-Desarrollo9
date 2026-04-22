import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cart.store';

export const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading, isError, error } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  if (isLoading) {
    return <div style={{textAlign: 'center', padding: '4rem 0'}}>Cargando productos destacados...</div>;
  }

  if (isError) {
    return <div style={{color: 'red', textAlign: 'center', padding: '4rem 0'}}>Error: {error?.message}</div>;
  }

  if (!products || products.length === 0) {
    return <div style={{textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)'}}>No hay productos destacados disponibles en este momento.</div>;
  }

  const featured = products.slice(0, 6);

  return (
    <section className="featured-section page-container stagger-3">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem'}}>
        <div>
          <h2 className="section-subhead">Selección Exclusiva</h2>
          <h3 className="section-headline" style={{marginTop: '0.5rem', fontSize: 'clamp(2.5rem, 5vw, 4rem)'}}>Destacados</h3>
        </div>
      </div>
      <div className="editorial-grid">
        {featured.map((product) => (
          <article key={product._id} className="product-card">
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
    </section>
  );
};
