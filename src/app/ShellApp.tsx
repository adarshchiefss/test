import React, { useMemo } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { createApi } from "../core/api";
import { createDevice } from "../core/device";
import { createEventBus } from "../core/events";
import {
  getScreenById,
  getStartScreenId,
  loadManifest,
} from "../core/manifest";
import { useNav } from "../core/navigation";
import { getScreenComponent } from "../generated/registry";

export default function ShellApp() {
  const manifest = useMemo(() => loadManifest(), []);
  const start = useMemo(() => getStartScreenId(manifest), [manifest]);

  const nav = useNav(manifest, start);
  const api = useMemo(() => createApi(), []);
  const device = useMemo(() => createDevice(), []);
  const bus = useMemo(() => createEventBus(), []);
  const brandColor = manifest.app.theme?.primary_color ?? "#000";
  const screen = getScreenById(manifest, nav.currentScreenId);

  if (!screen) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: brandColor }}>
          Screen not found
        </Text>
        <Text>
          No screen definition for:{" "}
          <Text style={{ fontWeight: "700" }}>{nav.currentScreenId}</Text>
        </Text>
      </SafeAreaView>
    );
  }

  const ScreenComponent = getScreenComponent(screen.screen_id);

  // Lightweight header: brand + current screen title
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          opacity: 0.9,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700" }}>
          {manifest.app.theme.brand_name}
        </Text>
        <Text style={{ fontSize: 12, opacity: 0.7 }}>{screen.title}</Text>
      </View>

      <ScreenComponent
        manifest={manifest}
        screen={screen}
        nav={nav}
        api={api}
        device={device}
        emit={bus.emit}
      />
    </SafeAreaView>
  );
}
