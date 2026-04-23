import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { warrantyService } from '../services/warranty.service';
import { useAuth } from '@clerk/clerk-react';

const warrantySchema = z.object({
  reason: z.string().min(1, 'Selecciona un motivo'),
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),
});

type WarrantyFormData = z.infer<typeof warrantySchema>;

const REASONS = [
  'Falla de fábrica',
  'Producto dañado en tránsito',
  'Error de software',
  'Problema de batería',
  'Otro',
];

const NewWarranty: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<WarrantyFormData>({
    resolver: zodResolver(warrantySchema),
  });

  if (!orderId) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-6">
        <div className="card" style={{ maxWidth: 400, padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Orden no especificada</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Selecciona un pedido desde "Mis Pedidos" para reportar una garantía.</p>
          <button onClick={() => navigate('/orders')} className="btn-primary" style={{ width: '100%' }}>
            Ver mis pedidos
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      setPreviews(prev => [...prev, ...selectedFiles.map(file => URL.createObjectURL(file))]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => { URL.revokeObjectURL(prev[index]); return prev.filter((_, i) => i !== index); });
  };

  const onSubmit = async (data: WarrantyFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error('Unauthenticated');

      let evidenceUrls: string[] = [];
      if (files.length > 0) {
        const uploadPromises = files.map(file => warrantyService.uploadEvidence(file, token));
        const uploadResults = await Promise.all(uploadPromises);
        evidenceUrls = uploadResults.map(res => res.url);
      }

      await warrantyService.createWarranty({
        orderId,
        reason: data.reason,
        description: data.description,
        evidenceUrls,
      }, token);

      navigate('/warranties/success');
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] py-12 px-6">
      <div className="page-container" style={{ maxWidth: 640 }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid var(--border)' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Reportar Garantía</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Completa el formulario para procesar tu reclamo.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group">
              <label className="input-group label">Motivo del reclamo</label>
              <select {...register('reason')} className="input">
                <option value="">Selecciona un motivo</option>
                {REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.reason && <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '4px' }}>{errors.reason.message}</p>}
            </div>

            <div className="input-group">
              <label className="input-group label">Descripción del problema</label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Describe detalladamente qué sucede con el producto..."
                className="input"
              />
              {errors.description && <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '4px' }}>{errors.description.message}</p>}
            </div>

            <div className="input-group">
              <label className="input-group label">Evidencias (Opcional)</label>
              <div style={{ border: '2px dashed var(--border)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="evidence-upload"
                />
                <label htmlFor="evidence-upload" className="btn-secondary" style={{ cursor: 'pointer' }}>
                  Seleccionar archivos
                </label>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Imágenes o videos del problema</p>
              </div>

              {previews.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                  {previews.map((src, index) => (
                    <div key={index} style={{ position: 'relative', aspectRatio: '1', border: '2px solid var(--border)', overflow: 'hidden' }}>
                      <img src={src} alt={`Evidencia ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', background: 'var(--error)', color: 'white', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ flex: 1 }}>
                {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
              </button>
              <button type="button" onClick={() => navigate('/orders')} className="btn-ghost">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewWarranty;