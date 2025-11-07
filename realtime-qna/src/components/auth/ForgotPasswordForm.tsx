import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations";
import { showSuccess, showError } from "@/lib/toast";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    const { error } = await resetPassword(data.email);

    if (error) {
      setError(error.message);
      showError(error.message || "비밀번호 재설정 링크 전송에 실패했습니다. 다시 시도해주세요.");
    } else {
      setSuccess(true);
      form.reset();
      showSuccess("비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.");
    }

    setLoading(false);
  };

  return (
    <Card role="region" aria-labelledby="forgot-password-title">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle id="forgot-password-title" className="text-xl sm:text-2xl">
          비밀번호 재설정
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="rounded-md bg-destructive/10 p-3 text-xs text-destructive sm:text-sm"
              >
                {error}
              </div>
            )}
            {success && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-md bg-green-500/10 p-3 text-xs text-green-600 dark:text-green-400 sm:text-sm"
              >
                비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.
              </div>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">이메일</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      disabled={loading || success}
                      autoComplete="email"
                      aria-label="이메일 주소"
                      aria-required="true"
                      className="text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full min-h-[44px] sm:min-h-[40px] touch-manipulation"
              disabled={loading || success}
              aria-label={
                loading
                  ? "비밀번호 재설정 링크 전송 중"
                  : success
                    ? "전송 완료"
                    : "비밀번호 재설정 링크 보내기"
              }
            >
              {loading ? (
                <span aria-live="polite">전송 중...</span>
              ) : success ? (
                "전송 완료"
              ) : (
                "재설정 링크 보내기"
              )}
            </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full min-h-[44px] sm:min-h-[40px] touch-manipulation"
            onClick={onBack}
            aria-label="로그인 페이지로 돌아가기"
          >
            돌아가기
          </Button>
        </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

