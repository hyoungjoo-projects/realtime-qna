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
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { showError } from "@/lib/toast";

interface LoginFormProps {
  onToggleMode: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ onToggleMode, onForgotPassword }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    const { error } = await signIn(data.email, data.password);

    if (error) {
      setError(error.message);
      showError(error.message || "로그인에 실패했습니다. 다시 시도해주세요.");
    }

    setLoading(false);
  };

  return (
    <Card role="region" aria-labelledby="login-title">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle id="login-title" className="text-xl sm:text-2xl">
          로그인
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          이메일과 비밀번호를 입력하여 로그인하세요.
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
                      autoComplete="current-password"
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full min-h-[44px] sm:min-h-[40px] touch-manipulation"
                disabled={loading}
                aria-label={loading ? "로그인 중" : "로그인"}
              >
                {loading ? (
                  <span aria-live="polite">로그인 중...</span>
                ) : (
                  "로그인"
                )}
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
      </Form>
    </Card>
  );
}

