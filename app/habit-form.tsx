import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
  Platform,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useHabit } from "../hooks/useHabit";
import { useCreateHabit } from "../hooks/useCreateHabit";
import { useUpdateHabit } from "../hooks/useUpdateHabit";
import { FrequencyType, TimeOfDay, GoalType } from "../lib/types";

const DAYS: { code: string; label: string }[] = [
  { code: "mon", label: "L" },
  { code: "tue", label: "M" },
  { code: "wed", label: "M" },
  { code: "thu", label: "J" },
  { code: "fri", label: "V" },
  { code: "sat", label: "S" },
  { code: "sun", label: "D" },
];

export default function HabitFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const router = useRouter();

  const { data: existingHabit } = useHabit(id);
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();

  const [name, setName] = useState("");
  const [frequencyType, setFrequencyType] = useState<FrequencyType>("daily");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timesPerWeek, setTimesPerWeek] = useState("3");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("anytime");
  const [goalType, setGoalType] = useState<GoalType>("boolean");
  const [goalValue, setGoalValue] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!existingHabit) return;
    setName(existingHabit.name);
    setFrequencyType(existingHabit.frequency_type);
    if (Array.isArray(existingHabit.frequency_value)) {
      setSelectedDays(existingHabit.frequency_value);
    } else if (existingHabit.frequency_value) {
      setTimesPerWeek(String(existingHabit.frequency_value.count));
    }
    setTimeOfDay(existingHabit.time_of_day);
    setGoalType(existingHabit.goal_type);
    setGoalValue(existingHabit.goal_value ? String(existingHabit.goal_value) : "");
    if (existingHabit.reminder_time) {
      setReminderEnabled(true);
      const [hours, minutes] = existingHabit.reminder_time.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      setReminderTime(date);
    }
  }, [existingHabit]);

  function toggleDay(code: string) {
    setSelectedDays((prev) =>
      prev.includes(code) ? prev.filter((d) => d !== code) : [...prev, code]
    );
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaveError(null);

    const frequency_value =
      frequencyType === "days_of_week"
        ? selectedDays
        : frequencyType === "times_per_week"
        ? { count: Number(timesPerWeek) || 1 }
        : null;

    const reminder_time = reminderEnabled
      ? `${String(reminderTime.getHours()).padStart(2, "0")}:${String(
          reminderTime.getMinutes()
        ).padStart(2, "0")}:00`
      : null;

    const payload = {
      name: name.trim(),
      frequency_type: frequencyType,
      frequency_value,
      time_of_day: timeOfDay,
      goal_type: goalType,
      goal_value: goalType === "boolean" ? null : Number(goalValue) || null,
      reminder_time,
    };

    try {
      if (isEditing && id) {
        await updateHabit.mutateAsync({ id, ...payload });
      } else {
        await createHabit.mutateAsync(payload);
      }
      router.back();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "No se pudo guardar");
    }
  }

  const isSaving = createHabit.isPending || updateHabit.isPending;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView className="flex-1 px-6 pt-2" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row justify-between items-center mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-blue-600 text-base">Cancelar</Text>
          </Pressable>
          <Text className="text-lg font-bold text-slate-800">
            {isEditing ? "Editar hábito" : "Nuevo hábito"}
          </Text>
          <Pressable onPress={handleSave} disabled={isSaving}>
            <Text className="text-blue-600 text-base font-semibold">
              {isSaving ? "..." : "Guardar"}
            </Text>
          </Pressable>
        </View>

        {saveError && (
          <Text className="text-red-500 text-center mb-3">{saveError}</Text>
        )}

        <Text className="text-sm font-medium text-slate-600 mb-1">Nombre</Text>
        <TextInput
          className="border border-slate-300 rounded-lg px-4 py-3 mb-5 text-base"
          placeholder="Ej: Leer"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-sm font-medium text-slate-600 mb-2">Frecuencia</Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {(
            [
              { value: "daily", label: "Todos los días" },
              { value: "days_of_week", label: "Días específicos" },
              { value: "times_per_week", label: "X veces/semana" },
            ] as { value: FrequencyType; label: string }[]
          ).map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setFrequencyType(option.value)}
              className={`px-3 py-2 rounded-full border ${
                frequencyType === option.value
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-slate-300"
              }`}
            >
              <Text className={frequencyType === option.value ? "text-white" : "text-slate-700"}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {frequencyType === "days_of_week" && (
          <View className="flex-row gap-2 mb-5">
            {DAYS.map((day) => (
              <Pressable
                key={day.code}
                onPress={() => toggleDay(day.code)}
                className={`w-9 h-9 rounded-full items-center justify-center border ${
                  selectedDays.includes(day.code)
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-slate-300"
                }`}
              >
                <Text className={selectedDays.includes(day.code) ? "text-white" : "text-slate-700"}>
                  {day.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {frequencyType === "times_per_week" && (
          <TextInput
            className="border border-slate-300 rounded-lg px-4 py-3 mb-5 text-base"
            placeholder="Ej: 3"
            keyboardType="number-pad"
            value={timesPerWeek}
            onChangeText={setTimesPerWeek}
          />
        )}

        <Text className="text-sm font-medium text-slate-600 mb-2 mt-2">Momento del día</Text>
        <View className="flex-row flex-wrap gap-2 mb-5">
          {(
            [
              { value: "morning", label: "Mañana" },
              { value: "afternoon", label: "Tarde" },
              { value: "night", label: "Noche" },
              { value: "anytime", label: "Cualquier momento" },
            ] as { value: TimeOfDay; label: string }[]
          ).map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setTimeOfDay(option.value)}
              className={`px-3 py-2 rounded-full border ${
                timeOfDay === option.value
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-slate-300"
              }`}
            >
              <Text className={timeOfDay === option.value ? "text-white" : "text-slate-700"}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-sm font-medium text-slate-600 mb-2">Meta mínima</Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {(
            [
              { value: "boolean", label: "Sin meta" },
              { value: "duration", label: "Duración (min)" },
              { value: "quantity", label: "Cantidad" },
            ] as { value: GoalType; label: string }[]
          ).map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setGoalType(option.value)}
              className={`px-3 py-2 rounded-full border ${
                goalType === option.value
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-slate-300"
              }`}
            >
              <Text className={goalType === option.value ? "text-white" : "text-slate-700"}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {goalType !== "boolean" && (
          <TextInput
            className="border border-slate-300 rounded-lg px-4 py-3 mb-5 text-base"
            placeholder={goalType === "duration" ? "Minutos, ej: 20" : "Cantidad, ej: 10"}
            keyboardType="number-pad"
            value={goalValue}
            onChangeText={setGoalValue}
          />
        )}

        <View className="flex-row items-center justify-between mt-2 mb-3">
          <Text className="text-sm font-medium text-slate-600">Recordatorio</Text>
          <Switch value={reminderEnabled} onValueChange={setReminderEnabled} />
        </View>

        {reminderEnabled && (
          <Pressable
            onPress={() => setShowTimePicker(true)}
            className="border border-slate-300 rounded-lg px-4 py-3 mb-5"
          >
            <Text className="text-base text-slate-700">
              {String(reminderTime.getHours()).padStart(2, "0")}:
              {String(reminderTime.getMinutes()).padStart(2, "0")}
            </Text>
          </Pressable>
        )}

        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_event, selectedDate) => {
              setShowTimePicker(false);
              if (selectedDate) setReminderTime(selectedDate);
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}