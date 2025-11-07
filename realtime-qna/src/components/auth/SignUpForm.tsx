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
import { signUpSchema, type SignUpFormData } from "@/lib/validations";
import { showSuccess, showError } from "@/lib/toast";

interface SignUpFormProps {
  onToggleMode: () => void;
}

export function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: SignUpFormData) => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    const { error } = await signUp(data.email, data.password);

    if (error) {
      setError(error.message);
      showError(error.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
    } else {
      setSuccess(true);
      form.reset();
      showSuccess("회원가입이 완료되었습니다! 이메일을 확인하여 인증을 완료하세요.");
    }

    setLoading(false);
  };

  return (
    <Card role="region" aria-labelledby="signup-title">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle id="signup-title" className="text-xl sm:text-2xl">
          회원가입
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          새 계정을 만들어 질문을 올리고 투표하세요.
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
                회원가입이 완료되었습니다! 이메일을 확인하여 인증을 완료하세요.
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
                      disabled={loading}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">
                    비밀번호
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      disabled={loading}
                      autoComplete="new-password"
                      aria-label="비밀번호"
                      aria-required="true"
                      className="text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">
                    비밀번호 확인
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      disabled={loading}
                      autoComplete="new-password"
                      aria-label="비밀번호 확인"
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
              disabled={loading}
              aria-label={loading ? "회원가입 중" : "회원가입"}
            >
              {loading ? (
                <span aria-live="polite">가입 중...</span>
              ) : (
                "회원가입"
              )}
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
      </Form>
    </Card>
  );
}

