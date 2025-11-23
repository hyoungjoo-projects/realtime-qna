/**
 * 접근성 유틸리티 함수
 */

/**
 * 키보드 이벤트 핸들러 생성
 * Enter 또는 Space 키로 클릭 이벤트를 트리거
 */
export function createKeyboardHandler(
  handler: () => void
): (e: React.KeyboardEvent) => void {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
  };
}

/**
 * 포커스를 특정 요소로 이동
 */
export function focusElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
}
