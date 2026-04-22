import { Context } from 'hono';
import { WarrantyReport } from '../models/WarrantyReport';
import { Order } from '../models/Order';

export const createWarrantyReport = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { orderId, description, evidenceUrls } = await c.req.json();

    if (!userId) {
      return c.json({ error: 'Unauthorized: User ID not found in context' }, 401);
    }

    // 1. Buscar la orden
    const order = await Order.findById(orderId);
    if (!order) {
      return c.json({ error: 'Orden no encontrada' }, 404);
    }

    // 2. Validar propiedad de la orden (Preventivo de Fraude)
    if (order.userId !== userId) {
      return c.json({ error: 'No autorizado: La orden no pertenece a este usuario' }, 403);
    }

    // 3. Validar plazo legal de 90 días
    const createdAt = (order as any).createdAt;
    const diffInMs = Date.now() - createdAt.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays > 90) {
      return c.json({ error: 'Garantía Expirada. Plazo Legal agotado' }, 400);
    }

    // 4. Crear el reporte
    const report = new WarrantyReport({
      orderId,
      userId,
      description,
      evidenceUrls: evidenceUrls || [],
      status: 'pending'
    });

    await report.save();
    
    return c.json({ 
      ticketId: report._id, 
      status: report.status 
    }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

export const getMyWarranties = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const reports = await WarrantyReport.find({ userId }).populate('orderId');
    return c.json(reports);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const updateWarrantyStatus = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    
    const report = await WarrantyReport.findByIdAndUpdate(
      id,
      { status: body.status, repairNotes: body.repairNotes },
      { new: true }
    );

    if (!report) return c.json({ error: 'Report not found' }, 404);
    return c.json(report);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};
