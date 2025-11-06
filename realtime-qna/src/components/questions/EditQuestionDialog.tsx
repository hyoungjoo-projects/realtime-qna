import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateQuestion } from "@/hooks/useQuestions";
import type { Database } from "@/types/supabase";

type Question = Database["public"]["Tables"]["questions"]["Row"];

interface EditQuestionDialogProps {
  question: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditQuestionDialog({
  question,
  open,
  onOpenChange,
}: EditQuestionDialogProps) {
  const [content, setContent] = useState(question.content);
  const updateQuestion = useUpdateQuestion();

  useEffect(() => {
    if (open) {
      setContent(question.content);
    }
  }, [open, question.content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    updateQuestion.mutate(
      {
        id: question.id,
        updates: { content: content.trim() },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">질문 수정</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              질문 내용을 수정하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-content" className="text-sm sm:text-base">
                질문 내용
              </Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="질문을 입력하세요..."
                rows={5}
                required
                disabled={updateQuestion.isPending}
                className="text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
              />
            </div>
            {updateQuestion.isError && (
              <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive sm:text-sm">
                {updateQuestion.error instanceof Error
                  ? updateQuestion.error.message
                  : "질문 수정에 실패했습니다."}
              </div>
            )}
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateQuestion.isPending}
              className="w-full min-h-[44px] sm:w-auto sm:min-h-[36px] touch-manipulation"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={updateQuestion.isPending}
              className="w-full min-h-[44px] sm:w-auto sm:min-h-[36px] touch-manipulation"
            >
              {updateQuestion.isPending ? "수정 중..." : "수정"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

