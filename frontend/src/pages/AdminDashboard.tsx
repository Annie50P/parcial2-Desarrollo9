import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { warrantyService } from '../services/warranty.service';
import { ordersService } from '../services/orders.service';
import { technicianService } from '../services/technician.service';
import type { IWarranty } from '../types/warranty';
import type { Order } from '../types/order';
import type { Technician } from '../types/technician';
import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import StatsCards from '../components/StatsCards';
import ProductTable from '../components/ProductTable';

type TabType = 'orders' | 'warranties' | 'products' | 'technicians';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const { data: technicians, isLoading: techniciansLoading } = useQuery<Technician[]>({
    queryKey: ['technicians'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return technicianService.getTechnicians(token);
    },
    enabled: isLoaded,
  });

  const assignTechMutation = useMutation({
    mutationFn: async ({ id, technicianId, technicianName }: { id: string; technicianId: string; technicianName: string }) => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return warrantyService.assignTechnician(id, technicianId, technicianName, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-warranties'] });
    }
  });

  const technicianMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; phone?: string }) => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return technicianService.createTechnician(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
    }
  });

  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  if (!isLoaded || ordersLoading || warrantiesLoading || techniciansLoading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <div className="loading animate-pulse">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar 
        activeSection={activeTab} 
        onNavigate={(section) => setActiveTab(section as TabType)}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
        />
      )}
      <main className="admin-layout">
        <button 
          className="mobile-menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: 'none',
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 101,
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 24, height: 24 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
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
                Productos
              </button>
              <button
                onClick={() => setActiveTab('technicians')}
                className={`admin-tab ${activeTab === 'technicians' ? 'active' : ''}`}
              >
                Técnicos
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
                        <td>{w.technicianName || '-'}</td>
                        <td>
                          <span className={`badge ${STATUS_COLORS[w.status] || 'badge-neutral'}`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="actions">
                          <select
                            className="admin-select"
                            value={w.technicianId || ''}
                            onChange={(e) => {
                              const techId = e.target.value;
                              const tech = technicians?.find(t => t._id === techId);
                              if (techId && tech) {
                                assignTechMutation.mutate({ id: w._id, technicianId: tech._id, technicianName: tech.name });
                              }
                            }}
                            disabled={assignTechMutation.isPending}
                          >
                            <option value="">Asignar técnico...</option>
                            {(technicians || []).map((tech) => (
                              <option key={tech._id} value={tech._id}>{tech.name}</option>
                            ))}
                          </select>
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

            {activeTab === 'products' && <ProductTable />}

            {activeTab === 'technicians' && (
              <div style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre</label>
                    <input
                      id="techName"
                      type="text"
                      className="input"
                      placeholder="Nombre del técnico"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
                    <input
                      id="techEmail"
                      type="email"
                      className="input"
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Teléfono</label>
                    <input
                      id="techPhone"
                      type="text"
                      className="input"
                      placeholder="+507 0000-0000"
                    />
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      const name = (document.getElementById('techName') as HTMLInputElement).value;
                      const email = (document.getElementById('techEmail') as HTMLInputElement).value;
                      const phone = (document.getElementById('techPhone') as HTMLInputElement).value;
                      if (name && email) {
                        technicianMutation.mutate({ name, email, phone });
                        (document.getElementById('techName') as HTMLInputElement).value = '';
                        (document.getElementById('techEmail') as HTMLInputElement).value = '';
                        (document.getElementById('techPhone') as HTMLInputElement).value = '';
                      }
                    }}
                    disabled={technicianMutation.isPending}
                  >
                    {technicianMutation.isPending ? 'Agregando...' : 'Agregar Técnico'}
                  </button>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(technicians || []).map((tech) => (
                        <tr key={tech._id}>
                          <td>{tech.name}</td>
                          <td>{tech.email}</td>
                          <td>{tech.phone || '-'}</td>
                          <td>
                            <span className="badge badge-success">
                              {tech.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!technicians || technicians.length === 0) && (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No hay técnicos registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}