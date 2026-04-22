import React, { useState } from 'react';
import { warrantyService } from '../services/warranty.service';

interface EvidenceUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const { url } = await warrantyService.uploadEvidence(file);
      onUploadSuccess(url);
    } catch (err: any) {
      setError('Error al subir la imagen. Intenta de nuevo.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Subir Evidencia (Imagen)</label>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {uploading && <p className="text-sm text-blue-500">Subiendo...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
