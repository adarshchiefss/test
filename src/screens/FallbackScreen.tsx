import React from "react";
import { View, Text, Pressable } from "react-native";
import type { ScreenComponentProps } from "../core/types";

export default function FallbackScreen(props: ScreenComponentProps) {
  const { screen, nav } = props;

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
        Missing Screen Component
      </Text>
      <Text style={{ marginBottom: 16 }}>
        No generated TSX component found for screen_id:{" "}
        <Text style={{ fontWeight: "700" }}>{screen.screen_id}</Text>
      </Text>

      <Pressable
        onPress={() => nav.go("home")}
        style={{
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          alignItems: "center",
        }}
      >
        <Text>Go Home</Text>
      </Pressable>
    </View>
  );
}
