import { apiClient } from '../axios';

export interface UploadResponse {
  url: string;
  publicId: string;
  originalName?: string;
  uploadTimeMs?: number;
}

export interface UploadResult {
  success: boolean;
  result?: UploadResponse;
  error?: string;
  originalName: string;
}

export const uploadService = {
  uploadImage: async (
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<UploadResponse> => {
    const startTime = performance.now();
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds - more reasonable for compressed images
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total || !onProgress) return;
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      },
    });

    const uploadTimeMs = Math.round(performance.now() - startTime);
    
    const data = response as unknown as UploadResponse;
    return {
      url: data.url,
      publicId: data.publicId,
      originalName: file.name,
      uploadTimeMs,
    };
  },

  /**
   * Upload multiple images with concurrency control
   * Process uploads in parallel batches to maximize speed without overwhelming the server
   */
  uploadMultiple: async (
    files: File[],
    options?: {
      onProgress?: (fileName: string, progress: number) => void;
      onComplete?: (fileName: string, result: UploadResponse) => void;
      onError?: (fileName: string, error: Error) => void;
      maxConcurrency?: number;
    }
  ): Promise<UploadResult[]> => {
    const maxConcurrency = options?.maxConcurrency || 3;
    const results: UploadResult[] = [];
    
    // Process in batches
    for (let i = 0; i < files.length; i += maxConcurrency) {
      const batch = files.slice(i, i + maxConcurrency);
      
      const batchPromises = batch.map(async (file) => {
        try {
          const result = await uploadService.uploadImage(
            file,
            (progress) => options?.onProgress?.(file.name, progress)
          );
          
          options?.onComplete?.(file.name, result);
          
          return {
            success: true,
            result,
            originalName: file.name,
          } as UploadResult;
        } catch (error) {
          const err = error as Error;
          options?.onError?.(file.name, err);
          
          return {
            success: false,
            error: err.message,
            originalName: file.name,
          } as UploadResult;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  },
};

