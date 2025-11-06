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

interface SignUpFormProps {
  onToggleMode: () => void;
}

export function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl">회원가입</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          새 계정을 만들어 질문을 올리고 투표하세요.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive sm:text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-500/10 p-3 text-xs text-green-600 dark:text-green-400 sm:text-sm">
              회원가입이 완료되었습니다! 이메일을 확인하여 인증을 완료하세요.
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-sm sm:text-base">
              이메일
            </Label>
            <Input
              id="signup-email"
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
            <Label htmlFor="signup-password" className="text-sm sm:text-base">
              비밀번호
            </Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm sm:text-base">
              비밀번호 확인
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
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
            {loading ? "가입 중..." : "회원가입"}
          </Button>
          <div className="text-center text-xs text-muted-foreground sm:text-sm">
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary underline-offset-4 hover:underline min-h-[44px] sm:min-h-[32px] touch-manipulation"
            >
              로그인
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

