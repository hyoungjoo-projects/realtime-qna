import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Vote = Database["public"]["Tables"]["votes"]["Row"];
type VoteInsert = Database["public"]["Tables"]["votes"]["Insert"];

// 특정 질문의 투표 수 조회
export function useVoteCount(questionId: string) {
  return useQuery({
    queryKey: ["votes", questionId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("question_id", questionId);

      if (error) throw error;
      return count ?? 0;
    },
  });
}

// 사용자가 특정 질문에 투표했는지 확인
export function useUserVote(questionId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ["user-vote", questionId, userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("question_id", questionId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data as Vote | null;
    },
    enabled: !!userId,
  });
}

// 투표 추가 (낙관적 업데이트)
export function useAddVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vote: VoteInsert) => {
      const { data, error } = await supabase
        .from("votes")
        .insert(vote)
        .select()
        .single();

      if (error) throw error;
      return data as Vote;
    },
    onMutate: async (vote) => {
      await queryClient.cancelQueries({
        queryKey: ["votes", vote.question_id],
      });
      await queryClient.cancelQueries({
        queryKey: ["user-vote", vote.question_id, vote.user_id],
      });

      const previousVoteCount = queryClient.getQueryData<number>([
        "votes",
        vote.question_id,
      ]);
      const previousUserVote = queryClient.getQueryData<Vote | null>([
        "user-vote",
        vote.question_id,
        vote.user_id,
      ]);

      // 낙관적 업데이트
      queryClient.setQueryData<number>(
        ["votes", vote.question_id],
        (old = 0) => old + 1
      );
      queryClient.setQueryData<Vote | null>(
        ["user-vote", vote.question_id, vote.user_id],
        {
          id: crypto.randomUUID(),
          question_id: vote.question_id,
          user_id: vote.user_id,
          created_at: new Date().toISOString(),
        } as Vote
      );

      return { previousVoteCount, previousUserVote };
    },
    onError: (_err, vote, context) => {
      if (context?.previousVoteCount !== undefined) {
        queryClient.setQueryData(
          ["votes", vote.question_id],
          context.previousVoteCount
        );
      }
      if (context?.previousUserVote !== undefined) {
        queryClient.setQueryData(
          ["user-vote", vote.question_id, vote.user_id],
          context.previousUserVote
        );
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["votes", data.question_id] });
      queryClient.invalidateQueries({
        queryKey: ["user-vote", data.question_id],
      });
    },
  });
}

// 투표 제거 (낙관적 업데이트)
export function useRemoveVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionId,
      userId,
    }: {
      questionId: string;
      userId: string;
    }) => {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("question_id", questionId)
        .eq("user_id", userId);

      if (error) throw error;
      return { questionId, userId };
    },
    onMutate: async ({ questionId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ["votes", questionId] });
      await queryClient.cancelQueries({
        queryKey: ["user-vote", questionId, userId],
      });

      const previousVoteCount = queryClient.getQueryData<number>([
        "votes",
        questionId,
      ]);
      const previousUserVote = queryClient.getQueryData<Vote | null>([
        "user-vote",
        questionId,
        userId,
      ]);

      // 낙관적 업데이트
      queryClient.setQueryData<number>(
        ["votes", questionId],
        (old = 0) => Math.max(0, old - 1)
      );
      queryClient.setQueryData<Vote | null>(
        ["user-vote", questionId, userId],
        null
      );

      return { previousVoteCount, previousUserVote };
    },
    onError: (_err, { questionId, userId }, context) => {
      if (context?.previousVoteCount !== undefined) {
        queryClient.setQueryData(
          ["votes", questionId],
          context.previousVoteCount
        );
      }
      if (context?.previousUserVote !== undefined) {
        queryClient.setQueryData(
          ["user-vote", questionId, userId],
          context.previousUserVote
        );
      }
    },
    onSuccess: ({ questionId }) => {
      queryClient.invalidateQueries({ queryKey: ["votes", questionId] });
      queryClient.invalidateQueries({
        queryKey: ["user-vote", questionId],
      });
    },
  });
}

// 투표 토글 (추가/제거)
export function useToggleVote() {
  const queryClient = useQueryClient();
  const addVote = useAddVote();
  const removeVote = useRemoveVote();

  return useMutation({
    mutationFn: async ({
      questionId,
      userId,
      hasVoted,
    }: {
      questionId: string;
      userId: string;
      hasVoted: boolean;
    }) => {
      if (hasVoted) {
        await removeVote.mutateAsync({ questionId, userId });
      } else {
        await addVote.mutateAsync({
          question_id: questionId,
          user_id: userId,
        });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["votes", variables.questionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-vote", variables.questionId],
      });
    },
  });
}

