import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadService, UploadResponse } from '@/lib/services/upload';

type UploadPayload =
  | File
  | {
      file: File;
      onProgress?: (progress: number) => void;
    };

export function useUploadImage() {
  return useMutation({
    mutationFn: (payload: UploadPayload) => {
      if (payload instanceof File) {
        return uploadService.uploadImage(payload);
      }
      return uploadService.uploadImage(payload.file, payload.onProgress);
    },
  });
}

interface UploadMultipleOptions {
  onProgress?: (fileName: string, progress: number) => void;
  onComplete?: (fileName: string, result: UploadResponse) => void;
  onError?: (fileName: string, error: Error) => void;
  maxConcurrency?: number;
}

export function useUploadMultiple() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      files, 
      options 
    }: { 
      files: File[]; 
      options?: UploadMultipleOptions 
    }) => {
      return uploadService.uploadMultiple(files, {
        maxConcurrency: options?.maxConcurrency || 3,
        onProgress: options?.onProgress,
        onComplete: options?.onComplete,
        onError: options?.onError,
      });
    },
    onSuccess: () => {
      // Invalidate products cache after successful uploads
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
