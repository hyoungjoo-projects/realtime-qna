import { useQuestions } from "@/hooks/useQuestions";
import { QuestionCard } from "./QuestionCard";
import { Skeleton } from "@/components/ui/skeleton";

export function QuestionList() {
  const { data: questions, isLoading, error } = useQuestions();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-4 space-y-4 sm:p-6"
          >
            <Skeleton className="h-3 w-1/4 sm:h-4" />
            <Skeleton className="h-16 w-full sm:h-20" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center sm:p-8">
        <p className="text-sm text-destructive sm:text-base">
          질문을 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground sm:p-8">
        <p className="text-sm sm:text-base">
          아직 질문이 없습니다. 첫 번째 질문을 올려보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}

