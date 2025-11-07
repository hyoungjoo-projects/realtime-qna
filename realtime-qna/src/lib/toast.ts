import { toast } from "sonner";

/**
 * 성공 토스트 알림
 */
export function showSuccess(message: string) {
  toast.success(message, {
    duration: 3000,
  });
}

/**
 * 에러 토스트 알림
 */
export function showError(message: string) {
  toast.error(message, {
    duration: 4000,
  });
}

/**
 * 정보 토스트 알림
 */
export function showInfo(message: string) {
  toast.info(message, {
    duration: 3000,
  });
}

/**
 * 경고 토스트 알림
 */
export function showWarning(message: string) {
  toast.warning(message, {
    duration: 3000,
  });
}

/**
 * 로딩 토스트 알림 (Promise와 함께 사용)
 */
export function showLoading<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
}

