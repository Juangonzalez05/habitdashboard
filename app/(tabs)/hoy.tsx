import { View, Text } from "react-native";

export default function HoyScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-slate-800">
        ¿Cómo va mi día?
      </Text>
      <Text className="mt-2 text-base text-slate-500 text-center">
        Acá vas a ver tus hábitos de hoy.
      </Text>
    </View>
  );
}