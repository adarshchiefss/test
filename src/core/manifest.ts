import type { Manifest } from "./types";

// Local manifest for MVP
// If you later want remote manifests, swap this to fetch().
import localManifest from "../../assets/manifest.json";

export function loadManifest(): Manifest {
  return localManifest as Manifest;
}

export function getStartScreenId(manifest: Manifest): string {
  const explicit = manifest.app.start_screen_id;
  if (explicit && manifest.screens.some(s => s.screen_id === explicit)) return explicit;

  // Prefer "home" if present
  const hasHome = manifest.screens.some(s => s.screen_id === "home");
  return hasHome ? "home" : manifest.screens[0]?.screen_id ?? "home";
}

export function getScreenById(manifest: Manifest, screenId: string) {
  return manifest.screens.find(s => s.screen_id === screenId) ?? null;
}
