import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onToggleMode: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ onToggleMode, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl">로그인</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          이메일과 비밀번호를 입력하여 로그인하세요.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive sm:text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm sm:text-base">
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full min-h-[44px] sm:min-h-[40px] touch-manipulation"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </Button>
          <div className="space-y-2 text-center text-xs sm:text-sm">
            <div className="text-muted-foreground">
              계정이 없으신가요?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary underline-offset-4 hover:underline min-h-[44px] sm:min-h-[32px] touch-manipulation"
              >
                회원가입
              </button>
            </div>
            {onForgotPassword && (
              <div>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-primary underline-offset-4 hover:underline min-h-[44px] sm:min-h-[32px] touch-manipulation"
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

