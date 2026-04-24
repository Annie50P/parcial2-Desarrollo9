export interface Technician {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  specialties?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}