import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Question = Database["public"]["Tables"]["questions"]["Row"];
type QuestionInsert = Database["public"]["Tables"]["questions"]["Insert"];
type QuestionUpdate = Database["public"]["Tables"]["questions"]["Update"];

// 질문 목록 조회
export function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Question[];
    },
  });
}

// 질문 생성 (낙관적 업데이트)
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question: QuestionInsert) => {
      const { data, error } = await supabase
        .from("questions")
        .insert(question)
        .select()
        .single();

      if (error) throw error;
      return data as Question;
    },
    onMutate: async (newQuestion) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({ queryKey: ["questions"] });

      // 이전 값 스냅샷
      const previousQuestions = queryClient.getQueryData<Question[]>([
        "questions",
      ]);

      // 낙관적 업데이트
      const optimisticQuestion: Question = {
        id: crypto.randomUUID(),
        ...newQuestion,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Question;

      queryClient.setQueryData<Question[]>(["questions"], (old = []) => [
        optimisticQuestion,
        ...old,
      ]);

      return { previousQuestions };
    },
    onError: (_err, _newQuestion, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousQuestions) {
        queryClient.setQueryData(["questions"], context.previousQuestions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

// 질문 수정 (낙관적 업데이트)
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: QuestionUpdate;
    }) => {
      const { data, error } = await supabase
        .from("questions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Question;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["questions"] });

      const previousQuestions = queryClient.getQueryData<Question[]>([
        "questions",
      ]);

      queryClient.setQueryData<Question[]>(["questions"], (old = []) =>
        old.map((q) =>
          q.id === id
            ? { ...q, ...updates, updated_at: new Date().toISOString() }
            : q
        )
      );

      return { previousQuestions };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQuestions) {
        queryClient.setQueryData(["questions"], context.previousQuestions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

// 질문 삭제 (낙관적 업데이트)
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("questions").delete().eq("id", id);

      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["questions"] });

      const previousQuestions = queryClient.getQueryData<Question[]>([
        "questions",
      ]);

      queryClient.setQueryData<Question[]>(["questions"], (old = []) =>
        old.filter((q) => q.id !== id)
      );

      return { previousQuestions };
    },
    onError: (_err, _id, context) => {
      if (context?.previousQuestions) {
        queryClient.setQueryData(["questions"], context.previousQuestions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

