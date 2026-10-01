/**
 * JAN_SAHAYAK — AUTHORITATIVE EVIDENCE & STORAGE SERVICE
 * Handles validation, sanitization, secure path generation, and persistence
 * for images, voice notes, field evidence, and verification documents.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_ROOT = path.resolve(__dirname, '../../public/uploads');

// Ensure local upload directories exist
const BUCKETS = ['complaints', 'voice', 'field-actions', 'verification', 'documents'];
BUCKETS.forEach(b => {
  const dir = path.join(UPLOAD_ROOT, b);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const ALLOWED_MIME_TYPES = {
  // Images
  'image/jpeg': { ext: 'jpg', maxBytes: 15 * 1024 * 1024 },
  'image/png': { ext: 'png', maxBytes: 15 * 1024 * 1024 },
  'image/webp': { ext: 'webp', maxBytes: 15 * 1024 * 1024 },
  'image/heic': { ext: 'heic', maxBytes: 15 * 1024 * 1024 },
  // Voice / Audio
  'audio/webm': { ext: 'webm', maxBytes: 25 * 1024 * 1024 },
  'audio/ogg': { ext: 'ogg', maxBytes: 25 * 1024 * 1024 },
  'audio/wav': { ext: 'wav', maxBytes: 25 * 1024 * 1024 },
  'audio/mpeg': { ext: 'mp3', maxBytes: 25 * 1024 * 1024 },
  'audio/mp4': { ext: 'm4a', maxBytes: 25 * 1024 * 1024 },
  // Documents
  'application/pdf': { ext: 'pdf', maxBytes: 20 * 1024 * 1024 }
};

export class StorageService {
  /**
   * Validate and persist uploaded file from Base64 or Buffer
   */
  static async saveEvidenceFile({
    base64Data,
    buffer,
    mimeType = 'image/jpeg',
    category = 'complaints',
    userId = 'anonymous'
  }) {
    const bucket = BUCKETS.includes(category) ? category : 'complaints';
    const config = ALLOWED_MIME_TYPES[mimeType.toLowerCase()];

    if (!config) {
      throw new Error(`Unsupported MIME type: ${mimeType}. Allowed formats: JPEG, PNG, WEBP, WebM, OGG, WAV, MP3, PDF.`);
    }

    let fileBuffer = buffer;
    if (!fileBuffer && base64Data) {
      const cleanBase64 = base64Data.includes('base64,') ? base64Data.split('base64,')[1] : base64Data;
      fileBuffer = Buffer.from(cleanBase64, 'base64');
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('No valid file data received.');
    }

    if (fileBuffer.length > config.maxBytes) {
      throw new Error(`File size (${(fileBuffer.length / (1024 * 1024)).toFixed(1)}MB) exceeds limit of ${config.maxBytes / (1024 * 1024)}MB.`);
    }

    // Generate non-guessable, sanitized storage path
    const randomHex = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const safeFilename = `${timestamp}_${randomHex}.${config.ext}`;
    const targetDir = path.join(UPLOAD_ROOT, bucket);
    const targetFilePath = path.join(targetDir, safeFilename);

    // Save to local public upload directory
    await fs.promises.writeFile(targetFilePath, fileBuffer);

    const publicUrl = `/uploads/${bucket}/${safeFilename}`;
    const storagePath = `${bucket}/${safeFilename}`;

    return {
      success: true,
      storagePath,
      publicUrl,
      fileName: safeFilename,
      mimeType,
      sizeBytes: fileBuffer.length,
      category: bucket,
      uploadedAt: new Date().toISOString()
    };
  }
}
