import type { CreateWarrantyDTO, IWarranty } from '../types/warranty';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const warrantyService = {
  async uploadEvidence(file: File, token: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/uploads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload evidence');
    return response.json();
  },

  async createWarranty(data: CreateWarrantyDTO, token: string): Promise<IWarranty> {
    const response = await fetch(`${API_URL}/warranties`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create warranty report');
    return response.json();
  },

  async getMyWarranties(token: string): Promise<IWarranty[]> {
    const response = await fetch(`${API_URL}/warranties/mine`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch warranties');
    return response.json();
  },

  async getAllWarranties(token: string): Promise<IWarranty[]> {
    const response = await fetch(`${API_URL}/warranties`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch all warranties');
    return response.json();
  },

  async updateWarrantyStatus(id: string, status: string, token: string, repairNotes?: string): Promise<IWarranty> {
    const response = await fetch(`${API_URL}/warranties/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, repairNotes }),
    });
    
    if (!response.ok) throw new Error('Failed to update warranty status');
    return response.json();
  }
};
