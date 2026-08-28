import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { getTodayDateString } from "../lib/date";

interface ToggleHabitParams {
  habitId: string;
  completed: boolean;
}

async function toggleHabit({ habitId, completed }: ToggleHabitParams) {
  const today = getTodayDateString();
  const { error } = await supabase
    .from("habit_logs")
    .upsert(
      { habit_id: habitId, date: today, completed },
      { onConflict: "habit_id,date" }
    );

  if (error) throw error;
}

export function useToggleHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit_logs", "today"] });
    },
  });
}