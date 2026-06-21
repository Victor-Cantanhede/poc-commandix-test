import { AxiosError } from 'axios';
import { toast } from 'sonner';

export function handleApiError(error: unknown, defaultMessage: string = 'Ocorreu um erro inesperado'): string {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (message) {
      if (Array.isArray(message)) {
        toast.error(message[0]);
        return message[0];
      } else {
        toast.error(message);
        return message;
      }
    }
  }
  
  if (error instanceof Error) {
    toast.error(error.message);
    return error.message;
  }

  toast.error(defaultMessage);
  return defaultMessage;
}

