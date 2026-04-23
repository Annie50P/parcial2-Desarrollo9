import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { warrantyService } from '../services/warranty.service';
import { ordersService } from '../services/orders.service';
import type { IWarranty } from '../types/warranty';
import type { Order } from '../types/order';
import { useState } from 'react';

type TabType = 'orders' | 'warranties';

const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-warning',
  paid: 'badge-success',
  review: 'badge-info',
  resolved: 'badge-success',
  rejected: 'badge-error',
  refunded: 'badge-error',
  shipped: 'badge-info',
};

export default function AdminDashboard() {
  const { getToken, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
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

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return warrantyService.updateWarrantyStatus(id, status, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-warranties'] });
    }
  });

  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  if (!isLoaded || ordersLoading || warrantiesLoading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <div className="loading animate-pulse">Cargando dashboard...</div>
      </div>
    );
  }

  const pendingCount = warranties?.filter(w => w.status === 'pending').length || 0;
  const paidCount = orders?.filter(o => o.status === 'paid').length || 0;

  return (
    <div className="admin-page">
      <div className="page-container">
        <div className="admin-header">
          <h1>Panel de Administración</h1>
          <p>Gestiona órdenes y garantías de clientes</p>
        </div>

        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Órdenes</span>
            <span className="admin-stat-value">{orders?.length || 0}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Órdenes Pagadas</span>
            <span className="admin-stat-value">{paidCount}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Tickets Abiertos</span>
            <span className="admin-stat-value">{pendingCount}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Garantías</span>
            <span className="admin-stat-value">{warranties?.length || 0}</span>
          </div>
        </div>

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
                      <td style={{ fontWeight: 700 }}>${order.total_amount?.toFixed(2)}</td>
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
                        onChange={(e) => mutation.mutate({ id: w._id, status: e.target.value })}
                        disabled={mutation.isPending}
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
      </div>
    </div>
  );
}