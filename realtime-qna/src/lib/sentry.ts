/**
 * Sentry 통합 설정
 * 
 * 사용 방법:
 * 1. @sentry/react 패키지 설치: npm install @sentry/react
 * 2. 환경 변수 설정: VITE_SENTRY_DSN
 * 3. main.tsx에서 initSentry() 호출
 */

// Sentry 초기화 함수 (선택적)
export function initSentry() {
  // Sentry가 설치되어 있고 DSN이 설정된 경우에만 초기화
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    console.log("Sentry DSN이 설정되지 않았습니다. 에러 추적이 비활성화됩니다.");
    return;
  }

  // Sentry 패키지가 설치되어 있는지 확인
  // 동적 import를 사용하여 Sentry 초기화 (선택적)
  // @ts-ignore - Sentry 패키지가 선택적이므로 타입 체크 우회
  import("@sentry/react")
    .then((Sentry: any) => {
      Sentry.init({
        dsn,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, // 프로덕션에서는 0.1로 낮춤
        // Session Replay
        replaysSessionSampleRate: 0.1, // 10%의 세션만 녹화
        replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100% 녹화
        environment: import.meta.env.MODE,
        beforeSend(event: any) {
          // 민감한 정보 필터링
          if (event.request) {
            delete event.request.cookies;
            if (event.request.headers) {
              delete event.request.headers.Authorization;
            }
          }
          return event;
        },
      });
    })
    .catch((error) => {
      console.warn("Sentry 패키지가 설치되지 않았습니다:", error);
    });
}

/**
 * 에러를 Sentry에 보고
 */
export function captureException(error: Error, context?: Record<string, any>) {
  // Sentry가 초기화된 경우에만 에러 전송
  if (typeof window !== "undefined" && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  }
}

/**
 * 메시지를 Sentry에 보고
 */
export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (typeof window !== "undefined" && (window as any).Sentry) {
    (window as any).Sentry.captureMessage(message, level);
  }
}

