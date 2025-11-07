import { z } from "zod";

// 질문 생성/수정 스키마
export const questionSchema = z.object({
  content: z
    .string()
    .min(1, "질문 내용을 입력해주세요.")
    .min(10, "질문은 최소 10자 이상이어야 합니다.")
    .max(1000, "질문은 최대 1000자까지 입력할 수 있습니다.")
    .trim(),
});

export type QuestionFormData = z.infer<typeof questionSchema>;

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// 회원가입 스키마
export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식이 아닙니다."),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요.")
      .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
      .max(72, "비밀번호는 최대 72자까지 입력할 수 있습니다."),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

// 비밀번호 재설정 스키마
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

