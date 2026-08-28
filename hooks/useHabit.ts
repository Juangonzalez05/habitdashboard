import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Habit } from "../lib/types";

async function fetchHabit(id: string): Promise<Habit> {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Habit;
}

export function useHabit(id?: string) {
  return useQuery({
    queryKey: ["habit", id],
    queryFn: () => fetchHabit(id as string),
    enabled: !!id,
  });
}