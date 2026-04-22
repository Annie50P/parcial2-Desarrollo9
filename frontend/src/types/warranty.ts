export interface IWarranty {
  _id: string;
  orderId: string;
  userId: string;
  description: string;
  evidenceUrls: string[];
  status: 'pending' | 'review' | 'resolved' | 'rejected';
  repairNotes?: string;
  createdAt: string;
}

export interface CreateWarrantyDTO {
  orderId: string;
  description: string;
  evidenceUrls: string[];
}
