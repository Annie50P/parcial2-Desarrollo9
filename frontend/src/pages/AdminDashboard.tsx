import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { warrantyService } from '../services/warranty.service';
import { ordersService } from '../services/orders.service';
import { productsService } from '../services/products.service';
import type { IWarranty } from '../types/warranty';
import type { Order } from '../types/order';
import type { Product } from '../types/product';
import type { CreateProductDTO, UpdateProductDTO } from '../services/products.service';
import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import StatsCards from '../components/StatsCards';
import ProductModal from '../components/ProductModal';

type TabType = 'orders' | 'warranties' | 'products';

const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-warning',
  paid: 'badge-success',
  review: 'badge-info',
  resolved: 'badge-success',
  rejected: 'badge-error',
  refunded: 'badge-error',
  shipped: 'badge-info',
};

const CONDITION_BADGES: Record<string, string> = {
  A: 'badge-success',
  B: 'badge-warning',
  C: 'badge-neutral',
};

export default function AdminDashboard() {
  const { getToken, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return ordersService.getAllOrders(token);
    },
    enabled: isLoaded,
  });

  const { data: warranties, isLoading: warrantiesLoading } = useQuery<IWarranty[]>({
    queryKey: ['admin-warranties'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return warrantyService.getAllWarranties(token);
    },
    enabled: isLoaded,
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return productsService.getAll(token);
    },
    enabled: isLoaded,
  });

  const warrantyMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return warrantyService.updateWarrantyStatus(id, status, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-warranties'] });
    }
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: CreateProductDTO) => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return productsService.create(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductDTO }) => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return productsService.update(id, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return productsService.delete(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });

  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmitProduct = async (data: CreateProductDTO | UpdateProductDTO) => {
    if (selectedProduct) {
      await updateProductMutation.mutateAsync({ id: selectedProduct._id, data });
    } else {
      await createProductMutation.mutateAsync(data as CreateProductDTO);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProductMutation.mutateAsync(id);
    }
  };

  if (!isLoaded || ordersLoading || warrantiesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <div className="loading animate-pulse">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar activeSection={activeTab} onNavigate={(section) => setActiveTab(section as TabType)} />
      <main className="admin-layout">
        <div className="admin-page">
          <div className="page-container">
            <div className="admin-header">
              <h1>Panel de Administración</h1>
              <p>Gestiona órdenes y garantías de clientes</p>
            </div>

            <StatsCards orders={orders} warranties={warranties} />

            <div className="admin-tabs">
              <button
                onClick={() => setActiveTab('orders')}
                className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
              >
                Órdenes ({orders?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('warranties')}
                className={`admin-tab ${activeTab === 'warranties' ? 'active' : ''}`}
              >
                Garantías ({warranties?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
              >
                Productos ({products?.length || 0})
              </button>
            </div>

            {activeTab === 'orders' && (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Usuario</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(orders || []).map((order) => {
                      const itemCount = (order.items || []).reduce((sum, i) => sum + i.quantity, 0);
                      return (
                        <tr key={order._id}>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>{(order as any).userDoc?.email || order.userId || '-'}</td>
                          <td>${order.total_amount?.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${STATUS_COLORS[order.status] || 'badge-neutral'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{itemCount}</td>
                        </tr>
                      );
                    })}
                    {(!orders || orders.length === 0) && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          No hay órdenes registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'warranties' && (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Usuario</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th className="actions">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(warranties || []).map((w: IWarranty) => (
                      <tr key={w._id}>
                        <td>{formatDate(w.createdAt)}</td>
                        <td>{w.userDoc?.email || w.userId}</td>
                        <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={w.description}>
                          {w.description}
                        </td>
                        <td>
                          <span className={`badge ${STATUS_COLORS[w.status] || 'badge-neutral'}`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="actions">
                          <select
                            className="admin-select"
                            value={w.status}
                            onChange={(e) => warrantyMutation.mutate({ id: w._id, status: e.target.value })}
                            disabled={warrantyMutation.isPending}
                          >
                            <option value="pending">Pendiente</option>
                            <option value="review">En Revisión</option>
                            <option value="resolved">Resuelto</option>
                            <option value="refunded">Reembolsado</option>
                            <option value="rejected">Rechazado</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {(!warranties || warranties.length === 0) && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          No hay garantías registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'products' && (
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
                                onClick={() => handleDeleteProduct(product._id)}
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
              </>
            )}
          </div>
        </div>
      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitProduct}
        product={selectedProduct}
        isLoading={createProductMutation.isPending || updateProductMutation.isPending}
      />
    </div>
  );
}