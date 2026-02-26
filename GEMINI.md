# AI App Studio POC

## Project Overview

This is a minimal Expo (TypeScript) "shell app" named "ai-app-studio-poc", designed as a target for a builder/codegen agent. It replaces traditional file-based routing with a custom manifest-driven architecture.

**Core Technologies & Architecture:**
*   **Framework:** React Native (v0.81) and Expo (SDK 54).
*   **Entry Point:** `App.tsx` (standard Expo entry, not Expo Router).
*   **Routing:** Manifest-driven custom routing system (`nav.go(screenId)`).
*   **Language:** TypeScript.
*   **Core Systems (`src/core/`):**
    *   **Manifest:** Loads `assets/manifest.json` to define the app's structure and screens.
    *   **Navigation:** Tiny router handling stack navigation.
    *   **Events:** A lightweight event bus (`emit(eventName, payload?)`).
    *   **API:** Mock API client (`api.call(route, payload)`).
    *   **Device:** Hardware capabilities, currently supporting image picking (`device.pickImageBase64()`).
*   **Modern Features (Enabled in `app.json`):**
    *   React Native New Architecture (`newArchEnabled: true`)
    *   React Compiler (`reactCompiler: true`)

## Building and Running

You can use standard `npm` commands or the Expo CLI to run the project.

*   **Install Dependencies:**
    ```bash
    npm install
    ```
*   **Start the Development Server (Expo CLI):**
    ```bash
    npm run start
    # or
    npx expo start
    ```
*   **Run on Android:**
    ```bash
    npm run android
    ```
*   **Run on iOS:**
    ```bash
    npm run ios
    ```
*   **Run on Web:**
    ```bash
    npm run web
    ```
*   **Linting:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Generated Screens:** All new screen components must be generated into the `src/generated/` directory (e.g., `src/generated/scr_home.tsx`).
*   **Component Signature:** Each generated screen must accept the `ScreenComponentProps` signature exported from `src/core/types.ts`:
    ```tsx
    export default function MyScreen(props: ScreenComponentProps) {
      const { nav, api, device, emit, screen, manifest } = props;
      // ...
    }
    ```
*   **Screen Registry:** After a screen is generated, it **must** be imported and added to `REGISTRY` object in `src/generated/registry.ts` mapping the `screen_id` to the component.
*   **Contracts:** Use only the provided contracts for interaction:
    *   `nav.go("screen_id", params?)` // Navigates to a screen with optional parameters.
    *   `nav.back()`
    *   `nav.resolve("event_name", params?)` // Dynamically navigates based on the current screen's `navigation` map with optional parameters.
    *   `nav.params` // Access parameters passed to the current screen.
    *   `api.call("agent_id", payload)`
    *   `device.pickImageBase64()`
    *   `emit("event_name", payload?)`
*   **Typing:** Use TypeScript for all source files.
*   **Assets:** Place static configuration like the app definition in `assets/manifest.json`. Image assets are configured in `app.json` and sourced from `assets/images/`.