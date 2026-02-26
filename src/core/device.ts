import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import type { Device } from "./types";

async function pickImageBase64Expo(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    throw new Error("Media library permission not granted.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    base64: true,
    quality: 0.7,
  });

  if (result.canceled) return null;
  const asset = result.assets?.[0];
  return asset?.base64 ?? null;
}

async function pickImageBase64Web(): Promise<string | null> {
  // Minimal web fallback: open file picker and read as base64
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result ?? "");
        // dataUrl is like: data:image/png;base64,XXXX
        const base64 = dataUrl.split(",")[1] ?? null;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

export function createDevice(): Device {
  return {
    pickImageBase64: async () => {
      if (Platform.OS === "web") return pickImageBase64Web();
      return pickImageBase64Expo();
    },
  };
}
