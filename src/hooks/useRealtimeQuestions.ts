import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Question = Database["public"]["Tables"]["questions"]["Row"];

/**
 * Supabase Realtime을 사용하여 questions 테이블의 변경사항을 실시간으로 동기화
 */
export function useRealtimeQuestions() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("questions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "questions",
        },
        (payload) => {
          console.log("Realtime event:", payload.eventType, payload);

          // 쿼리 캐시 무효화하여 최신 데이터 가져오기
          queryClient.invalidateQueries({ queryKey: ["questions"] });

          // 낙관적 업데이트와 충돌을 피하기 위해 약간의 지연
          // 또는 직접 캐시를 업데이트할 수도 있음
          if (payload.eventType === "INSERT") {
            queryClient.setQueryData<Question[]>(
              ["questions"],
              (old = []) => {
                const newQuestion = payload.new as Question;
                // 이미 존재하는지 확인 (낙관적 업데이트로 추가되었을 수 있음)
                const exists = old.some((q) => q.id === newQuestion.id);
                if (exists) {
                  return old.map((q) =>
                    q.id === newQuestion.id ? newQuestion : q
                  );
                }
                return [newQuestion, ...old];
              }
            );
          } else if (payload.eventType === "UPDATE") {
            queryClient.setQueryData<Question[]>(
              ["questions"],
              (old = []) =>
                old.map((q) =>
                  q.id === (payload.new as Question).id
                    ? (payload.new as Question)
                    : q
                )
            );
          } else if (payload.eventType === "DELETE") {
            queryClient.setQueryData<Question[]>(
              ["questions"],
              (old = []) => old.filter((q) => q.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}









