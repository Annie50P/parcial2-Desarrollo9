import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cart.store';
import { SkeletonCard } from './ui/Skeleton';
import { EmptyState } from './ui/EmptyState';

const CONDITIONS = ['Todos', 'Excellent', 'Good', 'Fair'];
const PRICE_RANGES = [
  { label: 'Todos los precios', min: 0,    max: Infinity },
  { label: 'Menos de $200',     min: 0,    max: 200      },
  { label: '$200 – $500',       min: 200,  max: 500      },
  { label: '$500 – $1000',      min: 500,  max: 1000     },
  { label: 'Más de $1000',      min: 1000, max: Infinity },
];

export const ProductList: React.FC = () => {
  const { data: products, isLoading, isError, error } = useProducts();
  const addItem    = useCartStore((s) => s.addItem);
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);

  const [condition, setCondition] = useState('Todos');
  const [priceIdx,  setPriceIdx]  = useState(0);

  const filtered = useMemo(() => {
    if (!products) return [];
    const range = PRICE_RANGES[priceIdx];
    return products.filter((p) => {
      const condOk  = condition === 'Todos' ||
        (p.condition ?? '').toLowerCase() === condition.toLowerCase();
      const priceOk = p.price >= range.min && p.price < range.max;
      return condOk && priceOk;
    });
  }, [products, condition, priceIdx]);

  if (isLoading) {
    return (
      <div>
        <FilterBar condition={condition} setCondition={setCondition} priceIdx={priceIdx} setPriceIdx={setPriceIdx} disabled />
        <div className="editorial-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        }
        title="Error al cargar"
        description={error?.message || 'No se pudieron cargar los productos.'}
      />
    );
  }

  return (
    <div>
      <FilterBar condition={condition} setCondition={setCondition} priceIdx={priceIdx} setPriceIdx={setPriceIdx} />

      {filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
          }
          title="Sin resultados"
          description="Ningún producto coincide con los filtros seleccionados."
          cta={
            <button className="btn-outline" onClick={() => { setCondition('Todos'); setPriceIdx(0); }}>
              Limpiar filtros
            </button>
          }
        />
      ) : (
        <div className="editorial-grid">
          {filtered.map((product) => (
            <article key={product._id} className="product-card">
              <div className="product-image-container">
                <span className="product-badge">{product.condition}</span>
                <img
                  src={
                    product.image_urls?.length
                      ? product.image_urls[0]
                      : `https://picsum.photos/seed/${product._id}/400/300`
                  }
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">${product.price.toFixed(2)}</div>
                <p className="product-desc">{product.description}</p>
                <p style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: product.stock <= 3 ? 'var(--warning)' : 'var(--ink3)',
                  marginBottom: '0.875rem',
                }}>
                  {product.stock <= 3 ? `Solo ${product.stock} disponibles` : `${product.stock} en stock`}
                </p>
                <div className="product-add-wrapper">
                  <button
                    className="product-add-btn"
                    onClick={() => { addItem(product); toggleDrawer(); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

interface FilterBarProps {
  condition:    string;
  setCondition: (v: string) => void;
  priceIdx:     number;
  setPriceIdx:  (v: number) => void;
  disabled?:   boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ condition, setCondition, priceIdx, setPriceIdx, disabled }) => (
  <div style={{
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    padding: '1rem 1.25rem',
    background: 'var(--white)',
    border: '1.5px solid var(--line)',
    borderRadius: 'var(--radius-card)',
  }}>
    {/* Condition pills */}
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {CONDITIONS.map((c) => (
        <button
          key={c}
          disabled={disabled}
          onClick={() => setCondition(c)}
          style={{
            padding: '6px 16px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: condition === c ? 'var(--ink)' : 'rgba(0,0,0,0.05)',
            color: condition === c ? 'var(--white)' : 'var(--ink2)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.82rem',
            fontWeight: condition === c ? 700 : 500,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {c}
        </button>
      ))}
    </div>

    {/* Separator */}
    <div style={{ width: 1, height: 22, background: 'var(--line)', flexShrink: 0 }} />

    {/* Price */}
    <select
      disabled={disabled}
      value={priceIdx}
      onChange={(e) => setPriceIdx(Number(e.target.value))}
      style={{
        padding: '7px 12px',
        border: '1.5px solid var(--line)',
        borderRadius: 'var(--radius-ui)',
        fontFamily: 'var(--font-display)',
        fontSize: '0.85rem',
        fontWeight: 500,
        background: 'var(--white)',
        color: 'var(--ink)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        minWidth: 180,
        outline: 'none',
        transition: 'border-color 0.2s ease',
      }}
      onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
      onBlur={e => (e.target.style.borderColor = 'var(--line)')}
    >
      {PRICE_RANGES.map((r, i) => (
        <option key={i} value={i}>{r.label}</option>
      ))}
    </select>
  </div>
);
