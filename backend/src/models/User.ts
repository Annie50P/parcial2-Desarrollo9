import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  clerk_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

export const User = model('User', userSchema);
