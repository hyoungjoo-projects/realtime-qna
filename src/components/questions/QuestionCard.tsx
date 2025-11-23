import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useDeleteQuestion } from "@/hooks/useQuestions";
import { useVoteCount, useUserVote, useToggleVote } from "@/hooks/useVotes";
import { EditQuestionDialog } from "./EditQuestionDialog";
import { ThumbsUp } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";
import type { Database } from "@/types/supabase";

type Question = Database["public"]["Tables"]["questions"]["Row"];

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const deleteQuestion = useDeleteQuestion();
  const { data: voteCount = 0 } = useVoteCount(question.id);
  const { data: userVote } = useUserVote(question.id, user?.id);
  const toggleVote = useToggleVote();

  const isOwner = user?.id === question.author_id;
  const hasVoted = !!userVote;

  const handleVote = () => {
    if (!user?.id) return;
    toggleVote.mutate(
      {
        questionId: question.id,
        userId: user.id,
        hasVoted,
      },
      {
        onSuccess: () => {
          showSuccess(hasVoted ? "투표가 취소되었습니다." : "투표가 완료되었습니다.");
        },
        onError: (error) => {
          showError(
            error instanceof Error
              ? error.message
              : "투표 처리에 실패했습니다. 다시 시도해주세요."
          );
        },
      }
    );
  };

  const handleDelete = () => {
    deleteQuestion.mutate(question.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        showSuccess("질문이 삭제되었습니다.");
      },
      onError: (error) => {
        showError(
          error instanceof Error
            ? error.message
            : "질문 삭제에 실패했습니다. 다시 시도해주세요."
        );
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <>
      <Card
        data-testid="question-card"
        role="article"
        aria-labelledby={`question-${question.id}-title`}
        className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/30"
      >
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="h-2 w-2 rounded-full bg-primary animate-pulse"
                  aria-hidden="true"
                />
                <time
                  dateTime={question.created_at}
                  className="text-xs text-muted-foreground sm:text-sm font-medium"
                >
                  {formatDate(question.created_at)}
                </time>
              </div>
              <p
                id={`question-${question.id}-title`}
                className="text-sm leading-relaxed whitespace-pre-wrap break-words sm:text-base text-foreground/90"
              >
                {question.content}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-3 border-t">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant={hasVoted ? "default" : "outline"}
                size="sm"
                onClick={handleVote}
                disabled={!user || isOwner || toggleVote.isPending}
                aria-label={
                  isOwner
                    ? "본인 질문에는 투표할 수 없습니다"
                    : hasVoted
                      ? `투표 취소 (현재 투표 수: ${voteCount})`
                      : `투표하기 (현재 투표 수: ${voteCount})`
                }
                aria-pressed={hasVoted}
                className={`gap-2 min-h-[44px] sm:min-h-[36px] touch-manipulation transition-all ${
                  hasVoted 
                    ? "shadow-md hover:shadow-lg" 
                    : "hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <ThumbsUp
                  className={`h-4 w-4 sm:h-4 sm:w-4 ${hasVoted ? "fill-current" : ""}`}
                  aria-hidden="true"
                />
                <span className="text-sm sm:text-sm font-medium" aria-live="polite">
                  {voteCount}
                </span>
              </Button>
            </div>

            {isOwner && (
              <div className="flex items-center gap-2" role="group" aria-label="질문 관리">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditDialog(true)}
                  aria-label="질문 수정"
                  className="min-h-[44px] sm:min-h-[36px] touch-manipulation hover:bg-accent"
                >
                  수정
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  aria-label="질문 삭제"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px] sm:min-h-[36px] touch-manipulation"
                >
                  삭제
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">
              질문 삭제
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              정말로 이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="w-full min-h-[44px] sm:w-auto sm:min-h-[36px] touch-manipulation">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full min-h-[44px] sm:w-auto sm:min-h-[36px] touch-manipulation"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showEditDialog && (
        <EditQuestionDialog
          question={question}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}
    </>
  );
}

