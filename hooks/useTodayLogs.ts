import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { HabitLog } from "../lib/types";
import { getTodayDateString } from "../lib/date";

async function fetchTodayLogs(): Promise<HabitLog[]> {
  const today = getTodayDateString();
  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("date", today);

  if (error) throw error;
  return data as HabitLog[];
}

export function useTodayLogs() {
  return useQuery({
    queryKey: ["habit_logs", "today"],
    queryFn: fetchTodayLogs,
  });
}