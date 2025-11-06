import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useNavigate } from "react-router-dom";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <ForgotPasswordForm onBack={() => navigate("/login")} />
      </div>
    </div>
  );
}








