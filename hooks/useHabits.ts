import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Habit } from "../lib/types";

async function fetchHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .neq("status", "archived")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Habit[];
}

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: fetchHabits,
  });
}