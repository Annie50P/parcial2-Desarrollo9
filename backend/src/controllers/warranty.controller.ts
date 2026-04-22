import { Context } from 'hono';
import { WarrantyReport } from '../models/WarrantyReport';

export const createWarrantyReport = async (c: Context) => {
  try {
    const body = await c.req.json();
    const userId = c.get('userId'); // Asumiendo que hay un middleware de auth que setea esto

    const report = new WarrantyReport({
      ...body,
      userId: userId || body.userId, // Fallback si no hay context pero si hay body
    });

    await report.save();
    return c.json(report, 201);
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
