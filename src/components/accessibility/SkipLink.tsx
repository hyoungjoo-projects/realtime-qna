import { focusElement } from "@/lib/accessibility";

interface SkipLinkProps {
  targetId: string;
  label?: string;
}

/**
 * 스킵 링크 컴포넌트 (키보드 사용자를 위한)
 */
export function SkipLink({
  targetId,
  label = "메인 콘텐츠로 건너뛰기",
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      onClick={(e) => {
        e.preventDefault();
        focusElement(targetId);
      }}
    >
      {label}
    </a>
  );
}

