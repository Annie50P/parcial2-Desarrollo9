export interface IWarranty {
  _id: string;
  orderId: string | any;
  userDoc?: { email: string, role: string };
  userId: string;
  description: string;
  evidenceUrls: string[];
  status: 'pending' | 'review' | 'resolved' | 'rejected' | 'refunded';
  repairNotes?: string;
  createdAt: string;
}

export interface CreateWarrantyDTO {
  orderId: string;
  description: string;
  evidenceUrls: string[];
}
