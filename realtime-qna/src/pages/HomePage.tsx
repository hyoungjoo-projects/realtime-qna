import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRealtimeQuestions } from "@/hooks/useRealtimeQuestions";
import { useRealtimeVotes } from "@/hooks/useRealtimeVotes";
import { CreateQuestionForm } from "@/components/questions/CreateQuestionForm";
import { QuestionList } from "@/components/questions/QuestionList";
import { LogOut, User } from "lucide-react";

export function HomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Realtime 구독 활성화
  useRealtimeQuestions();
  useRealtimeVotes();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* 배경 장식 요소 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* 헤더 */}
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                실시간 Q&A
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                커뮤니티와 함께 질문하고 답변하세요
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border shadow-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground sm:text-sm truncate max-w-[200px]">
                  {user?.email}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full sm:w-auto gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </div>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="space-y-6 sm:space-y-8">
          <div className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_0.1s_forwards]">
            <CreateQuestionForm />
          </div>
          <div className="opacity-0 animate-[fadeIn_0.7s_ease-in-out_0.3s_forwards]">
            <QuestionList />
          </div>
        </main>
      </div>
    </div>
  );
}

