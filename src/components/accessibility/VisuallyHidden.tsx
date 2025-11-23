interface VisuallyHiddenProps {
  children: React.ReactNode;
}

/**
 * 스크린 리더 전용 텍스트 (시각적으로 숨김)
 */
export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <span className="sr-only" aria-live="polite">
      {children}
    </span>
  );
}

