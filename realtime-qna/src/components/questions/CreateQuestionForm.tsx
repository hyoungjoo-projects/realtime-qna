import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateQuestion } from "@/hooks/useQuestions";
import { MessageSquarePlus, Loader2 } from "lucide-react";

export function CreateQuestionForm() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const createQuestion = useCreateQuestion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user?.id) return;

    createQuestion.mutate(
      {
        content: content.trim(),
        author_id: user.id,
      },
      {
        onSuccess: () => {
          setContent("");
        },
      }
    );
  };

  return (
    <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4 sm:pb-6 border-b">
        <div className="flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg sm:text-xl">새 질문 작성</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="question-content" className="text-sm font-medium sm:text-base">
              질문 내용
            </Label>
            <Textarea
              id="question-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="궁금한 점을 자유롭게 질문해보세요..."
              rows={4}
              required
              disabled={createQuestion.isPending}
              className="text-sm sm:text-base min-h-[100px] sm:min-h-[120px] resize-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          {createQuestion.isError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive sm:text-sm">
              {createQuestion.error instanceof Error
                ? createQuestion.error.message
                : "질문 작성에 실패했습니다."}
            </div>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createQuestion.isPending || !content.trim()}
              className="min-w-[120px] min-h-[44px] sm:min-h-[40px] touch-manipulation gap-2 shadow-md hover:shadow-lg transition-all"
            >
              {createQuestion.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  작성 중...
                </>
              ) : (
                <>
                  <MessageSquarePlus className="h-4 w-4" />
                  질문 올리기
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

