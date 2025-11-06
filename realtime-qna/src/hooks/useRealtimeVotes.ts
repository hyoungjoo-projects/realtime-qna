import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Vote = Database["public"]["Tables"]["votes"]["Row"];

/**
 * Supabase Realtime을 사용하여 votes 테이블의 변경사항을 실시간으로 동기화
 */
export function useRealtimeVotes() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("votes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
        },
        (payload) => {
          console.log("Realtime vote event:", payload.eventType, payload);

          const vote = payload.new as Vote | null;
          const oldVote = payload.old as Vote | null;
          const questionId = vote?.question_id || oldVote?.question_id;

          if (!questionId) return;

          // 투표 수 쿼리 무효화
          queryClient.invalidateQueries({ queryKey: ["votes", questionId] });

          // 직접 캐시 업데이트 (낙관적 업데이트와 충돌 방지)
          if (payload.eventType === "INSERT" && vote) {
            // 투표 수 증가
            queryClient.setQueryData<number>(
              ["votes", questionId],
              (old = 0) => old + 1
            );

            // 사용자 투표 상태 업데이트
            queryClient.setQueryData<Vote | null>(
              ["user-vote", questionId, vote.user_id],
              vote
            );
          } else if (payload.eventType === "DELETE" && oldVote) {
            // 투표 수 감소
            queryClient.setQueryData<number>(
              ["votes", questionId],
              (old = 0) => Math.max(0, old - 1)
            );

            // 사용자 투표 상태 제거
            queryClient.setQueryData<Vote | null>(
              ["user-vote", questionId, oldVote.user_id],
              null
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








