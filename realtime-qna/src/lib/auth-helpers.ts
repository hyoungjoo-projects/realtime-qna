import type { User } from "@supabase/supabase-js";

/**
 * 사용자가 인증되었는지 확인
 */
export function isAuthenticated(user: User | null): boolean {
  return !!user;
}

/**
 * 사용자 ID가 특정 ID와 일치하는지 확인
 */
export function isOwner(user: User | null, ownerId: string | null | undefined): boolean {
  if (!user || !ownerId) return false;
  return user.id === ownerId;
}

/**
 * 사용자 이메일 가져오기
 */
export function getUserEmail(user: User | null): string | null {
  return user?.email ?? null;
}

/**
 * 사용자 ID 가져오기
 */
export function getUserId(user: User | null): string | null {
  return user?.id ?? null;
}

/**
 * 사용자 메타데이터 가져오기
 */
export function getUserMetadata(user: User | null): Record<string, any> | null {
  return user?.user_metadata ?? null;
}

