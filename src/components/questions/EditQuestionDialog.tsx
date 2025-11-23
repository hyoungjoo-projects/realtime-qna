import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateQuestion } from "@/hooks/useQuestions";
import { questionSchema, type QuestionFormData } from "@/lib/validations";
import { showSuccess, showError } from "@/lib/toast";
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
  const updateQuestion = useUpdateQuestion();

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      content: question.content,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        content: question.content,
      });
    }
  }, [open, question.content, form]);

  const handleSubmit = (data: QuestionFormData) => {
    updateQuestion.mutate(
      {
        id: question.id,
        updates: { content: data.content },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          showSuccess("질문이 성공적으로 수정되었습니다.");
        },
        onError: (error) => {
          showError(
            error instanceof Error
              ? error.message
              : "질문 수정에 실패했습니다. 다시 시도해주세요."
          );
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">질문 수정</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                질문 내용을 수정하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      질문 내용
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="질문을 입력하세요..."
                        rows={5}
                        disabled={updateQuestion.isPending}
                        aria-label="질문 내용 수정"
                        aria-required="true"
                        className="text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateQuestion.isPending}
                aria-label="질문 수정 취소"
                className="w-full min-h-[44px] sm:w-auto sm:min-h-[36px] touch-manipulation"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={updateQuestion.isPending}
                aria-label={updateQuestion.isPending ? "질문 수정 중" : "질문 수정 완료"}
                className="w-full min-h-[44px] sm:w-auto sm:min-h-[36px] touch-manipulation"
              >
                {updateQuestion.isPending ? (
                  <span aria-live="polite">수정 중...</span>
                ) : (
                  "수정"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

