import { CreateWarrantyDTO, IWarranty } from '../types/warranty';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const warrantyService = {
  async uploadEvidence(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/uploads`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload evidence');
    return response.json();
  },

  async createWarranty(data: CreateWarrantyDTO): Promise<IWarranty> {
    const response = await fetch(`${API_URL}/warranties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create warranty report');
    return response.json();
  },

  async getMyWarranties(): Promise<IWarranty[]> {
    const response = await fetch(`${API_URL}/warranties/mine`);
    if (!response.ok) throw new Error('Failed to fetch warranties');
    return response.json();
  }
};
