/**
 * Client-side image compression utility
 * Compresses images before upload to reduce transfer time
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

// Optimized defaults for admin uploads - aggressive compression for speed
const defaultOptions: CompressionOptions = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.80,
  maxSizeMB: 1.5,
};

// Fast thumbnail preview options
const previewOptions: CompressionOptions = {
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.70,
  maxSizeMB: 0.5,
};

/**
 * Compress an image file before upload
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<Blob> {
  const opts = { ...defaultOptions, ...options };

  // If file is already small enough, return as-is
  if (file.size <= opts.maxSizeMB! * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;

      if (width > opts.maxWidth! || height > opts.maxHeight!) {
        const ratio = Math.min(
          opts.maxWidth! / width,
          opts.maxHeight! / height
        );
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        opts.quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Create a data URL for instant preview
 * For large files, creates a fast compressed thumbnail first
 */
export async function createImagePreview(file: File): Promise<string> {
  // For large files (> 2MB), create a fast compressed thumbnail
  if (file.size > 2 * 1024 * 1024) {
    try {
      const thumbnailBlob = await compressImage(file, previewOptions);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(thumbnailBlob);
      });
    } catch {
      // Fallback to direct reading if compression fails
    }
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Create a blob URL for instant preview (fastest - no processing)
 */
export function createInstantPreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke a blob URL to free memory
 */
export function revokeInstantPreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
