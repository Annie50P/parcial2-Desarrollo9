import { Context } from 'hono';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '../services/r2.service';

export const uploadEvidenceController = async (c: Context) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;

    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    // Nota: La URL pública depende de la configuración del bucket en Cloudflare (Public Bucket o Worker)
    // Por ahora devolvemos el Key o una URL construida si tenemos el host
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    return c.json({ 
      message: 'Upload successful',
      url: publicUrl,
      key: fileName
    });

  } catch (error: any) {
    console.error('[Upload Error]:', error);
    return c.json({ error: 'Failed to upload file to R2' }, 500);
  }
};
