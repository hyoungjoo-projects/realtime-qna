import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuth } from "@/contexts/AuthContext";
import { useCreateQuestion } from "@/hooks/useQuestions";
import { MessageSquarePlus, Loader2 } from "lucide-react";
import { questionSchema, type QuestionFormData } from "@/lib/validations";
import { showSuccess, showError } from "@/lib/toast";

export function CreateQuestionForm() {
  const { user } = useAuth();
  const createQuestion = useCreateQuestion();

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = (data: QuestionFormData) => {
    if (!user?.id) return;

    createQuestion.mutate(
      {
        content: data.content,
        author_id: user.id,
      },
      {
        onSuccess: () => {
          form.reset();
          showSuccess("질문이 성공적으로 작성되었습니다.");
        },
        onError: (error) => {
          showError(
            error instanceof Error
              ? error.message
              : "질문 작성에 실패했습니다. 다시 시도해주세요."
          );
        },
      }
    );
  };

  return (
    <Card
      className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
      role="region"
      aria-labelledby="create-question-title"
    >
      <CardHeader className="pb-4 sm:pb-6 border-b">
        <div className="flex items-center gap-2">
          <MessageSquarePlus
            className="h-5 w-5 text-primary"
            aria-hidden="true"
          />
          <CardTitle id="create-question-title" className="text-lg sm:text-xl">
            새 질문 작성
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium sm:text-base">
                    질문 내용
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="궁금한 점을 자유롭게 질문해보세요..."
                      rows={4}
                      disabled={createQuestion.isPending}
                      aria-label="질문 내용 입력"
                      aria-required="true"
                      className="text-sm sm:text-base min-h-[100px] sm:min-h-[120px] resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={createQuestion.isPending}
                aria-label={createQuestion.isPending ? "질문 작성 중" : "질문 올리기"}
                className="min-w-[120px] min-h-[44px] sm:min-h-[40px] touch-manipulation gap-2 shadow-md hover:shadow-lg transition-all"
              >
                {createQuestion.isPending ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span aria-live="polite">작성 중...</span>
                  </>
                ) : (
                  <>
                    <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                    질문 올리기
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

