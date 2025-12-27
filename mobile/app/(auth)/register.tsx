import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/src/lib/auth-context";
import { Feather } from "@expo/vector-icons";

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    const result = await register(username, email, password);

    if (!result.success) {
      setError(result.error || "Registration failed");
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
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
                <Feather name="zap" size={40} color="#FFFFFF" />
              </View>
              <Text className="text-3xl font-bold text-foreground">Join REWIRE</Text>
              <Text className="text-muted-foreground mt-2 text-center">
                Start your transformation journey
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
                  placeholder="Choose a username"
                  placeholderTextColor="#A0A0A0"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View className="mt-4">
                <Text className="text-foreground mb-2 font-medium">Email</Text>
                <TextInput
                  className="bg-card border border-border rounded-xl px-4 py-4 text-foreground"
                  placeholder="Enter your email"
                  placeholderTextColor="#A0A0A0"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>

              <View className="mt-4">
                <Text className="text-foreground mb-2 font-medium">Password</Text>
                <View className="relative">
                  <TextInput
                    className="bg-card border border-border rounded-xl px-4 py-4 text-foreground pr-12"
                    placeholder="Create a password"
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

              <View className="mt-4">
                <Text className="text-foreground mb-2 font-medium">Confirm Password</Text>
                <TextInput
                  className="bg-card border border-border rounded-xl px-4 py-4 text-foreground"
                  placeholder="Confirm your password"
                  placeholderTextColor="#A0A0A0"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                className={`bg-primary rounded-xl py-4 mt-6 ${isLoading ? "opacity-70" : ""}`}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-muted-foreground">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-semibold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
