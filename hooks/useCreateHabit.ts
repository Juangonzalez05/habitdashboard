import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { FrequencyType, TimeOfDay, GoalType } from "../lib/types";

interface NewHabitInput {
  name: string;
  frequency_type: FrequencyType;
  frequency_value: string[] | { count: number } | null;
  time_of_day: TimeOfDay;
  goal_type: GoalType;
  goal_value: number | null;
  reminder_time: string | null;
}

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NewHabitInput) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("No hay sesión activa");

      const { error } = await supabase.from("habits").insert({
        ...input,
        user_id: userData.user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}