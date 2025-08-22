export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// Simple fallback implementation that logs to console
export function useToast() {
  return {
    toast: (options: ToastOptions) => {
      console.log('Toast:', options);
    }
  };
}
