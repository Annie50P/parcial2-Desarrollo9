import { Context } from 'hono';
import { Technician } from '../models/Technician';

export const getTechnicians = async (c: Context) => {
  try {
    const technicians = await Technician.find({ active: true });
    return c.json(technicians);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const createTechnician = async (c: Context) => {
  try {
    const body = await c.req.json();
    const technician = await Technician.create(body);
    return c.json(technician, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

export const deleteTechnician = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const technician = await Technician.findByIdAndUpdate(id, { active: false });
    if (!technician) return c.json({ error: 'Technician not found' }, 404);
    return c.json({ message: 'Technician deactivated' });
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};