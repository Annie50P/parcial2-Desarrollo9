import { z } from 'zod';

export const createWarrantySchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID format'),
  reason: z.string().min(1, 'Debe seleccionar un motivo'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  evidenceUrls: z.array(z.string()).optional().default([]),
});

export const updateStatusSchema = z.object({
  status: z.enum(['review', 'resolved', 'refunded', 'rejected']),
  repairNotes: z.string().optional()
});
