import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { FrequencyType, TimeOfDay, GoalType } from "../lib/types";

interface UpdateHabitInput {
  id: string;
  name: string;
  frequency_type: FrequencyType;
  frequency_value: string[] | { count: number } | null;
  time_of_day: TimeOfDay;
  goal_type: GoalType;
  goal_value: number | null;
  reminder_time: string | null;
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateHabitInput) => {
      const { error } = await supabase.from("habits").update(input).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["habit", variables.id] });
    },
  });
}