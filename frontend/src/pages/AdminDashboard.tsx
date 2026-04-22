import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { warrantyService } from '../services/warranty.service';
import type { IWarranty } from '../types/warranty';

export default function AdminDashboard() {
  const { getToken, isLoaded } = useAuth();

  const { data: warranties, isLoading, isError } = useQuery<IWarranty[]>({
    queryKey: ['admin-warranties'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return warrantyService.getAllWarranties(token);
    },
    enabled: isLoaded,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string, status: string, notes?: string }) => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return warrantyService.updateWarrantyStatus(id, status, token, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-warranties'] });
    }
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    mutation.mutate({ id, status: newStatus });
  };

  if (!isLoaded || isLoading) return <div className="loading">Cargando dashboard...</div>;
  if (isError) return <div className="error">Error cargando el dashboard.</div>;

  return (
    <div className="admin-dashboard container pt-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard de Tickets de Garantía</h1>

      <div className="table-container bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-4 px-6 border-b">ID Ticket</th>
              <th className="py-4 px-6 border-b">Usuario</th>
              <th className="py-4 px-6 border-b">Descripción</th>
              <th className="py-4 px-6 border-b">Estado</th>
              <th className="py-4 px-6 border-b text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(warranties || []).map((w: IWarranty) => (
              <tr key={w._id} className="hover:bg-gray-50">
                <td className="py-4 px-6 border-b text-sm">{w._id}</td>
                <td className="py-4 px-6 border-b text-sm">
                  {w.userDoc?.email || w.userId}
                </td>
                <td className="py-4 px-6 border-b text-sm max-w-xs truncate">
                  {w.description}
                </td>
                <td className="py-4 px-6 border-b">
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${w.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${w.status === 'review' ? 'bg-blue-100 text-blue-800' : ''}
                    ${w.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                    ${['rejected', 'refunded'].includes(w.status) ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {w.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-6 border-b text-right space-x-2">
                  <select
                    title="Change Status"
                    className="border rounded p-1 text-sm bg-white"
                    value={w.status}
                    onChange={(e) => handleStatusChange(w._id, e.target.value)}
                    disabled={mutation.isPending}
                  >
                    <option value="pending">Pending</option>
                    <option value="review">Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="refunded">Refunded</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
            {warranties?.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 px-6 text-center text-gray-500">
                  No hay garantías registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}