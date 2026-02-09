import React, { Component, ReactNode } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, spacing } from "@/src/theme";
import { Text, H2, Button } from "@/src/components/ui";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              padding: spacing.xl,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View className="items-center gap-4">
              <View className="w-20 h-20 bg-destructive/20 rounded-full items-center justify-center">
                <Feather name="alert-circle" size={40} color={colors.destructive} />
              </View>
              <H2 color="foreground" align="center">
                Something went wrong
              </H2>
              <Text variant="body" color="mutedForeground" align="center" className="max-w-sm">
                {this.state.error?.message || "An unexpected error occurred. Please try again."}
              </Text>
              <Button variant="default" onPress={this.handleReset} className="mt-4">
                Try Again
              </Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
