import { useState, useEffect } from 'react';
import type { Product } from '../types/product';
import type { CreateProductDTO, UpdateProductDTO } from '../services/products.service';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductDTO | UpdateProductDTO) => Promise<void>;
  product?: Product | null;
  isLoading?: boolean;
}

const CONDITIONS = [
  { value: 'A', label: 'Condición A - Excelente' },
  { value: 'B', label: 'Condición B - Bueno' },
  { value: 'C', label: 'Condición C - Regular' },
];

export default function ProductModal({ isOpen, onClose, onSubmit, product, isLoading }: ProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [condition, setCondition] = useState<'A' | 'B' | 'C'>('A');
  const [imageUrls, setImageUrls] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setCondition(product.condition);
      setImageUrls(product.image_urls.join(', '));
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setCondition('A');
      setImageUrls('');
    }
    setError('');
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);

    if (!name.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setError('El stock debe ser 0 o mayor');
      return;
    }

    const imageUrlsArray = imageUrls
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: priceNum,
      stock: stockNum,
      condition,
      image_urls: imageUrlsArray,
    };

    try {
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar producto');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button className="modal-close" onClick={onClose} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nombre del producto"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descripción del producto (opcional)"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Precio *</label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock *</label>
              <input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="condition">Condición</label>
            <select
              id="condition"
              value={condition}
              onChange={e => setCondition(e.target.value as 'A' | 'B' | 'C')}
            >
              {CONDITIONS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrls">URLs de Imágenes</label>
            <input
              id="imageUrls"
              type="text"
              value={imageUrls}
              onChange={e => setImageUrls(e.target.value)}
              placeholder="https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg"
            />
            <span className="form-hint">Separar múltiples URLs con comas</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}