import { Text, FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useHabits } from "../../hooks/useHabits";
import { useAuth } from "../../lib/auth";

export default function HabitosScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { data: habits, isLoading } = useHabits();

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-2" edges={["top"]}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-slate-800">Hábitos</Text>
        <Pressable
          onPress={() => router.push("../habit-form")}
          className="bg-blue-600 rounded-full w-9 h-9 items-center justify-center"
        >
          <Text className="text-white text-xl leading-none">+</Text>
        </Pressable>
      </View>

      {isLoading && <Text className="text-slate-500">Cargando...</Text>}

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-px bg-slate-100" />}
        ListEmptyComponent={
          !isLoading ? (
            <Text className="text-slate-500 text-center mt-10">
              Todavía no tenés hábitos. Tocá "+" para crear el primero.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: "../habit-form", params: { id: item.id } })}
            className="py-4"
          >
            <Text className="text-base text-slate-800 font-medium">{item.name}</Text>
          </Pressable>
        )}
      />

      {/* TODO: temporal — se va a mover a una pantalla de Ajustes más adelante */}
      <Pressable className="mt-4 mb-6 bg-slate-200 rounded-lg px-4 py-2 self-start" onPress={signOut}>
        <Text className="text-slate-700 font-medium">Cerrar sesión</Text>
      </Pressable>
    </SafeAreaView>
  );
}