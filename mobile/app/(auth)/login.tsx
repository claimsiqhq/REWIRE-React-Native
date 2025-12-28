import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/src/lib/auth-context";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setError("");
    const result = await login(username, password);

    if (!result.success) {
      setError(result.error || "Login failed");
    } else {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 py-8 justify-center">
            {/* Logo & Title */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
                <Feather name="zap" size={40} color="#FFFFFF" />
              </View>
              <Text className="text-3xl font-bold text-foreground">REWIRE</Text>
              <Text className="text-muted-foreground mt-2 text-center">
                Transform your life, one day at a time
              </Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-destructive/20 p-3 rounded-lg mb-4">
                <Text className="text-destructive text-center">{error}</Text>
              </View>
            ) : null}

            {/* Form */}
            <View className="space-y-4">
              <View>
                <Text className="text-foreground mb-2 font-medium">Username</Text>
                <TextInput
                  className="bg-card border border-border rounded-xl px-4 py-4 text-foreground"
                  placeholder="Enter your username"
                  placeholderTextColor="#A0A0A0"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View className="mt-4">
                <Text className="text-foreground mb-2 font-medium">Password</Text>
                <View className="relative">
                  <TextInput
                    className="bg-card border border-border rounded-xl px-4 py-4 text-foreground pr-12"
                    placeholder="Enter your password"
                    placeholderTextColor="#A0A0A0"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#A0A0A0"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                className={`bg-primary rounded-xl py-4 mt-6 ${isLoading ? "opacity-70" : ""}`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-muted-foreground">Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
