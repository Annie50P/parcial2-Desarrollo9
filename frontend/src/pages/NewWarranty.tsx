import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { warrantyService } from '../services/warranty.service';

const warrantySchema = z.object({
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder los 500 caracteres'),
  reason: z.string().min(1, 'Debe seleccionar un motivo'),
});

type WarrantyFormData = z.infer<typeof warrantySchema>;

const REASONS = [
  'Falla de fábrica',
  'Producto dañado en el envío',
  'Software/Error de sistema',
  'Batería/Carga',
  'Otro',
];

const NewWarranty: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WarrantyFormData>({
    resolver: zodResolver(warrantySchema),
  });

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0] p-6">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full">
          <h1 className="text-2xl font-black mb-4 uppercase italic">Error</h1>
          <p className="mb-6 font-bold">No se especificó un ID de orden válido.</p>
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-black text-white font-black py-3 px-6 hover:bg-white hover:text-black border-2 border-black transition-colors uppercase italic"
          >
            Volver a mis pedidos
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data: WarrantyFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // 1. Subir archivos en paralelo
      const uploadPromises = files.map(file => warrantyService.uploadEvidence(file));
      const uploadResults = await Promise.all(uploadPromises);
      const evidenceUrls = uploadResults.map(res => res.url);

      // 2. Crear reporte de garantía
      await warrantyService.createWarranty({
        orderId,
        description: `[${data.reason}] ${data.description}`,
        evidenceUrls,
      });

      navigate('/warranties/success');
    } catch (err) {
      setError('Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
        <h1 className="text-4xl font-black mb-8 uppercase italic tracking-tighter">
          Reportar Garantía
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Motivo */}
          <div>
            <label className="block text-xl font-black uppercase mb-2">Motivo del reclamo</label>
            <select
              {...register('reason')}
              className="w-full border-4 border-black p-3 font-bold focus:ring-4 focus:ring-yellow-400 outline-none"
            >
              <option value="">Selecciona un motivo</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.reason && (
              <p className="text-red-600 font-bold mt-1 text-sm">{errors.reason.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xl font-black uppercase mb-2">Descripción del problema</label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Explica detalladamente qué sucede con el producto..."
              className="w-full border-4 border-black p-3 font-bold focus:ring-4 focus:ring-yellow-400 outline-none resize-none"
            />
            {errors.description && (
              <p className="text-red-600 font-bold mt-1 text-sm">{errors.description.message}</p>
            )}
          </div>

          {/* Evidencias */}
          <div>
            <label className="block text-xl font-black uppercase mb-2">Evidencias (Fotos/Video)</label>
            <div className="border-4 border-dashed border-black p-6 flex flex-col items-center">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="evidence-upload"
              />
              <label
                htmlFor="evidence-upload"
                className="cursor-pointer bg-yellow-400 text-black font-black py-2 px-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                SELECCIONAR ARCHIVOS
              </label>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative aspect-square border-4 border-black">
                    <img src={src} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-3 -right-3 bg-red-600 text-white w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-600 p-4 font-bold text-red-600">
              {error}
            </div>
          )}

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-black py-4 px-8 text-2xl uppercase italic border-4 border-black transition-all ${
                isSubmitting 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-white hover:text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none'
              }`}
            >
              {isSubmitting ? 'Enviando Ticket...' : 'Enviar Ticket de Garantía'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewWarranty;
