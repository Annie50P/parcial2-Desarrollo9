import React, { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cart.store';
import { SkeletonCard } from './ui/Skeleton';
import { EmptyState } from './ui/EmptyState';

const ITEMS_PER_PAGE = 12;

const CONDITIONS = [
  { label: 'Todas', value: '' },
  { label: 'A (Excelente)', value: 'A' },
  { label: 'B (Buena)', value: 'B' },
  { label: 'C (Regular)', value: 'C' },
];

const CATEGORIES = [
  { label: 'Todos', value: '' },
  { label: 'Celulares', value: 'celular' },
  { label: 'Laptops', value: 'laptop' },
  { label: 'PCs', value: 'pc' },
  { label: 'Auriculares', value: 'auriculares' },
  { label: 'Tablets', value: 'tablet' },
];

const PRICE_RANGES = [
  { label: 'Cualquier precio', min: 0, max: Infinity },
  { label: 'Menos de $200', min: 0, max: 200 },
  { label: '$200 – $500', min: 200, max: 500 },
  { label: '$500 – $1000', min: 500, max: 1000 },
  { label: 'Más de $1000', min: 1000, max: Infinity },
];

export const ProductList: React.FC = () => {
  const { data: products, isLoading, isError, error } = useProducts();
  const addItem = useCartStore((s) => s.addItem);
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);

  const [condition, setCondition] = useState('');
  const [category, setCategory] = useState('');
  const [priceIdx, setPriceIdx] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!products) return [];
    const range = PRICE_RANGES[priceIdx];
    const searchLower = search.toLowerCase().trim();
    return products.filter((p) => {
      const condOk = !condition || p.condition === condition;
      const catOk = !category || p.category === category;
      const priceOk = p.price >= range.min && p.price < range.max;
      const searchOk = !searchLower || 
        p.name.toLowerCase().includes(searchLower) || 
        p.description?.toLowerCase().includes(searchLower);
      return condOk && catOk && priceOk && searchOk;
    });
  }, [products, condition, category, priceIdx, search]);

  useEffect(() => setPage(1), [condition, category, priceIdx, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div>
        <FilterBar condition={condition} setCondition={setCondition} category={category} setCategory={setCategory} priceIdx={priceIdx} setPriceIdx={setPriceIdx} search={search} setSearch={setSearch} disabled />
        <div className="products-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>}
        title="Error al cargar"
        description={error?.message || 'No se pudieron cargar los productos.'}
      />
    );
  }

  return (
    <div>
      <FilterBar condition={condition} setCondition={setCondition} category={category} setCategory={setCategory} priceIdx={priceIdx} setPriceIdx={setPriceIdx} search={search} setSearch={setSearch} />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" /></svg>}
          title="Sin resultados"
          description="Ningún producto coincide con los filtros seleccionados."
          cta={<button className="btn-outline" onClick={() => { setCondition(''); setCategory(''); setPriceIdx(0); setSearch(''); }}>Limpiar filtros</button>}
        />
      ) : (
        <>
          <div className="products-grid">
            {paginatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} onAdd={() => { addItem(product); toggleDrawer(); }} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', paddingBottom: '2rem' }}>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                style={{
                  padding: '8px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-ui)',
                  background: page === 1 ? 'var(--gray-light)' : 'var(--white)',
                  color: page === 1 ? 'var(--gray)' : 'var(--ink)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  opacity: page === 1 ? 0.5 : 1,
                }}
              >
                Anterior
              </button>

              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    style={{
                      minWidth: 36,
                      padding: '8px',
                      border: '1px solid',
                      borderColor: page === p ? 'var(--ink)' : 'var(--line)',
                      borderRadius: 'var(--radius-ui)',
                      background: page === p ? 'var(--ink)' : 'transparent',
                      color: page === p ? 'var(--white)' : 'var(--ink)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8rem',
                      fontWeight: page === p ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                style={{
                  padding: '8px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-ui)',
                  background: page === totalPages ? 'var(--gray-light)' : 'var(--white)',
                  color: page === totalPages ? 'var(--gray)' : 'var(--ink)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  opacity: page === totalPages ? 0.5 : 1,
                }}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface ProductCardProps {
  product: { _id: string; name: string; price: number; description?: string; condition: string; stock: number; image_urls?: string[] };
  onAdd: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const badgeColor = product.condition === 'A' ? 'var(--ink)' : product.condition === 'B' ? '#D97706' : 'var(--line)';
  const badgeText = product.condition === 'A' ? 'var(--white)' : product.condition === 'B' ? 'var(--white)' : 'var(--ink2)';

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'var(--white)', border: `1px solid ${hovered ? 'var(--ink)' : 'var(--line)'}`, transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.08)' : 'none' }}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {!imgLoaded && <div style={{ position: 'absolute', inset: 0, background: 'var(--cream)' }} />}
        <img
          src={product.image_urls?.[0] || `https://picsum.photos/seed/${product._id}/400/300`}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)', opacity: imgLoaded ? 1 : 0 }}
        />
        <span style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', background: badgeColor, color: badgeText, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
          Cond. {product.condition}
        </span>
      </div>

      <div style={{ padding: '1.25rem 1rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '0.5rem', letterSpacing: '-0.01em', fontFamily: 'var(--font-display)', lineHeight: 1.35 }}>
          {product.name}
        </h3>
        <p style={{ fontSize: '1.1rem', fontWeight: 300, color: 'var(--ink)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
          ${product.price.toFixed(2)}
        </p>
        <p style={{ fontSize: '0.75rem', color: product.stock <= 3 ? '#DC2626' : 'var(--gray)', marginBottom: '1rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: product.stock <= 3 ? '#DC2626' : 'var(--gray)' }} />
          {product.stock <= 3 ? `Solo ${product.stock} disponibles` : `${product.stock} en stock`}
        </p>
        <button
          onClick={onAdd}
          disabled={product.stock === 0}
          style={{ width: '100%', padding: '10px', background: hovered && product.stock > 0 ? 'var(--ink)' : 'transparent', color: hovered && product.stock > 0 ? 'var(--white)' : product.stock === 0 ? 'var(--gray)' : 'var(--ink)', border: `1px solid ${hovered && product.stock > 0 ? 'var(--ink)' : 'var(--line)'}`, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', cursor: product.stock > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease', opacity: product.stock === 0 ? 0.5 : 1 }}
        >
          {product.stock === 0 ? 'Agotado' : 'Añadir al carrito'}
        </button>
      </div>
    </article>
  );
};

interface FilterBarProps {
  condition: string;
  setCondition: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  priceIdx: number;
  setPriceIdx: (v: number) => void;
  search: string;
  setSearch: (v: string) => void;
  disabled?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ condition, setCondition, category, setCategory, priceIdx, setPriceIdx, search, setSearch, disabled }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
    {/* Search */}
    <div style={{ position: 'relative' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink2)" strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '14px 16px 14px 46px',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-display)',
          fontSize: '0.9rem',
          background: 'var(--white)',
          color: 'var(--ink)',
          outline: 'none',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--ink)';
          e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--line)';
          e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
        }}
      />
      {search && (
        <button
          onClick={() => setSearch('')}
          disabled={disabled}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: 'var(--ink3)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
    {/* Category filters */}
    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
      {CATEGORIES.map((cat) => (
        <button key={cat.value} onClick={() => setCategory(cat.value)} disabled={disabled} style={{ padding: '6px 14px', borderRadius: '2px', border: 'none', background: category === cat.value ? 'var(--ink)' : 'transparent', color: category === cat.value ? 'var(--white)' : 'var(--ink2)', fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: category === cat.value ? 600 : 400, letterSpacing: '0.5px', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', opacity: disabled ? 0.5 : 1 }}>
          {cat.label}
        </button>
      ))}
    </div>
    {/* Condition & Price filters */}
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
        {CONDITIONS.map((cond) => (
          <button key={cond.value} onClick={() => setCondition(cond.value)} disabled={disabled} style={{ padding: '6px 12px', borderRadius: '2px', border: '1px solid var(--line)', background: condition === cond.value ? 'var(--ink)' : 'transparent', color: condition === cond.value ? 'var(--white)' : 'var(--ink2)', fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: condition === cond.value ? 600 : 400, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', opacity: disabled ? 0.5 : 1 }}>
            {cond.label}
          </button>
        ))}
      </div>
      <div style={{ width: 1, height: 20, background: 'var(--line)' }} />
      <select value={priceIdx} onChange={(e) => setPriceIdx(Number(e.target.value))} disabled={disabled} style={{ padding: '6px 12px', border: '1px solid var(--line)', borderRadius: '2px', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', background: 'var(--white)', color: 'var(--ink)', cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none' }}>
        {PRICE_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
      </select>
    </div>
  </div>
);