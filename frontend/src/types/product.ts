export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  condition: 'A' | 'B' | 'C';
  image_urls: string[];
  createdAt: string;
  updatedAt: string;
}