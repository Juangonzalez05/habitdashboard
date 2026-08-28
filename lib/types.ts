export type FrequencyType = "daily" | "days_of_week" | "times_per_week";
export type TimeOfDay = "morning" | "afternoon" | "night" | "anytime";
export type GoalType = "boolean" | "duration" | "quantity";
export type HabitStatus = "active" | "paused" | "archived";

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  frequency_type: FrequencyType;
  frequency_value: string[] | { count: number } | null;
  time_of_day: TimeOfDay;
  goal_type: GoalType;
  goal_value: number | null;
  reminder_time: string | null;
  status: HabitStatus;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  progress_value: number | null;
  created_at: string;
}