import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cart.store';
import { Link } from 'react-router-dom';

export const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading, isError } = useProducts();
  const addItem = useCartStore((state) => state.addItem);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);

  if (isLoading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (isError) {
    return <div className="error-state"><h3>Error al cargar productos</h3></div>;
  }

  if (!products || products.length === 0) {
    return null;
  }

  const featured = products.slice(0, 6);

  return (
    <section style={{ padding: '6rem 0', background: 'var(--bg-primary)' }}>
      <div className="page-container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '3rem',
          paddingBottom: '2rem',
          borderBottom: '2px solid var(--border)',
        }}>
          <div>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              color: 'var(--accent)',
              marginBottom: '0.75rem',
            }}>
              Verificados por técnicos
            </p>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 600,
              letterSpacing: '-1px',
              lineHeight: 1,
            }}>
              Productos destacados
            </h2>
          </div>
          <Link
            to="/home"
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'var(--text-secondary)',
              borderBottom: '2px solid var(--border)',
              paddingBottom: '4px',
            }}
          >
            Ver todo →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2px',
          background: 'var(--border)',
          border: '2px solid var(--border)',
        }}>
          {featured.map((product) => (
            <article
              key={product._id}
              className="product-card"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4/3',
                overflow: 'hidden',
                background: 'var(--bg-muted)',
              }}>
                <span style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '4px 12px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  zIndex: 2,
                }}>
                  {product.condition}
                </span>
                <img
                  src={product.image_urls?.[0] || `https://picsum.photos/seed/${product._id}/400/300`}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  lineHeight: 1.2,
                }}>
                  {product.name}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {product.description}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                  }}>
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => {
                      addItem(product);
                      toggleDrawer();
                    }}
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.8rem' }}
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};