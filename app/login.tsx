import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useAuth } from "../lib/auth";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);
    if (signInError) {
      setError("Email o contraseña incorrectos.");
    }
  }

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-slate-800 mb-6 text-center">
        Habit Dashboard
      </Text>

      <TextInput
        className="border border-slate-300 rounded-lg px-4 py-3 mb-3 text-base"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border border-slate-300 rounded-lg px-4 py-3 mb-3 text-base"
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && (
        <Text className="text-red-500 text-center mb-3">{error}</Text>
      )}

      <Pressable
        className="bg-blue-600 rounded-lg py-3 items-center"
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">Ingresar</Text>
        )}
      </Pressable>
    </View>
  );
}