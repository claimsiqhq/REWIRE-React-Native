import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
      <Text className="text-xl font-bold text-foreground mb-4">
        This screen doesn't exist.
      </Text>
      <Link href="/" asChild>
        <View className="mt-4 py-4">
          <Text className="text-primary text-base">Go to home screen</Text>
        </View>
      </Link>
    </View>
  );
}
