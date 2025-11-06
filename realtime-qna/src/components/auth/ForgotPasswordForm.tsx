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

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl">비밀번호 재설정</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
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
              비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-sm sm:text-base">
              이메일
            </Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || success}
              className="text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full min-h-[44px] sm:min-h-[40px] touch-manipulation"
            disabled={loading || success}
          >
            {loading ? "전송 중..." : success ? "전송 완료" : "재설정 링크 보내기"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full min-h-[44px] sm:min-h-[40px] touch-manipulation"
            onClick={onBack}
          >
            돌아가기
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

