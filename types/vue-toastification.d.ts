declare module 'vue-toastification' {
  export interface PluginOptions {
    position?: string;
    timeout?: number;
    closeOnClick?: boolean;
    pauseOnFocusLoss?: boolean;
    pauseOnHover?: boolean;
    draggable?: boolean;
    draggablePercent?: number;
    showCloseButtonOnHover?: boolean;
    hideProgressBar?: boolean;
    closeButton?: string | boolean;
    icon?: boolean;
    rtl?: boolean;
    maxToasts?: number;
    newestOnTop?: boolean;
    toastClassName?: string;
    bodyClassName?: string;
    containerClassName?: string;
  }

  export interface ToastOptions {
    id?: string | number;
    type?: 'success' | 'info' | 'warning' | 'error' | 'default';
    position?: string;
    timeout?: number;
    closeOnClick?: boolean;
    pauseOnFocusLoss?: boolean;
    pauseOnHover?: boolean;
    draggable?: boolean;
    draggablePercent?: number;
    showCloseButtonOnHover?: boolean;
    hideProgressBar?: boolean;
    closeButton?: string | boolean;
    icon?: boolean;
    rtl?: boolean;
  }

  export interface ToastInterface {
    success(message: string, options?: ToastOptions): string | number;
    error(message: string, options?: ToastOptions): string | number;
    info(message: string, options?: ToastOptions): string | number;
    warning(message: string, options?: ToastOptions): string | number;
    default(message: string, options?: ToastOptions): string | number;
    clear(): void;
    dismiss(id: string | number): void;
    update(id: string | number, options: ToastOptions): void;
  }

  export function useToast(): ToastInterface;
}
