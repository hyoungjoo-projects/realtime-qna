import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

type AuthMode = "login" | "signup" | "forgot-password";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {mode === "login" && (
          <LoginForm
            onToggleMode={() => setMode("signup")}
            onForgotPassword={() => setMode("forgot-password")}
          />
        )}
        {mode === "signup" && (
          <SignUpForm onToggleMode={() => setMode("login")} />
        )}
        {mode === "forgot-password" && (
          <ForgotPasswordForm onBack={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}

