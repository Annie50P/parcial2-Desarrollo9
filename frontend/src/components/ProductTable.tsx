import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import type { Product } from '../types/product';
import type { UpdateProductDTO } from '../services/products.service';
import { productsService } from '../services/products.service';
import ProductModal from './ProductModal';
import type { CreateProductDTO } from '../services/products.service';

const CONDITION_BADGES: Record<string, string> = {
  A: 'badge-success',
  B: 'badge-warning',
  C: 'badge-neutral',
};

export default function ProductTable() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const t = await getToken();
      if (!t) throw new Error('No token');
      return productsService.getAll(t);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateProductDTO) => {
      const t = await getToken();
      if (!t) throw new Error('No token');
      return productsService.create(data, t);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductDTO }) => {
      const t = await getToken();
      if (!t) throw new Error('No token');
      return productsService.update(id, data, t);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const t = await getToken();
      if (!t) throw new Error('No token');
      return productsService.delete(id, t);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleSubmit = async (data: CreateProductDTO | UpdateProductDTO) => {
    if (selectedProduct) {
      await updateMutation.mutateAsync({ id: selectedProduct._id, data });
    } else {
      await createMutation.mutateAsync(data as CreateProductDTO);
    }
  };

  if (isLoading) {
    return (
      <div className="loading animate-pulse" style={{ padding: '2rem', textAlign: 'center' }}>
        Cargando productos...
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleOpenCreate}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Condición</th>
              <th className="actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((product) => (
              <tr key={product._id}>
                <td style={{ fontWeight: 600 }}>{product.name}</td>
                <td style={{ fontWeight: 600 }}>${product.price.toFixed(2)}</td>
                <td>
                  <span style={{ color: product.stock <= 5 ? 'var(--error)' : 'inherit', fontWeight: 600 }}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={`badge ${CONDITION_BADGES[product.condition] || 'badge-neutral'}`}>
                    {product.condition}
                  </span>
                </td>
                <td className="actions">
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      className="btn-ghost"
                      onClick={() => handleOpenEdit(product)}
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 18, height: 18 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 20H5.25A2.25 2.25 0 0 1 3 17.75V8.75A2.25 2.25 0 0 1 5.25 6.5h9" />
                      </svg>
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => handleDelete(product._id)}
                      title="Eliminar"
                      style={{ color: 'var(--error)' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 18, height: 18 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        product={selectedProduct}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
}