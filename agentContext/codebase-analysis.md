# Codebase Analysis Report

- Repo: `adarshchiefss/test`
- Ref: `main`
- Generated (UTC): `2026-02-26T11:00:38.7681747Z`

## Result (JSON)

```json
{
  "repo": "adarshchiefss/test",
  "ref": "main",
  "file_structure": [
    "app.json",
    "App.tsx",
    "assets",
    "assets/images",
    "assets/images/android-icon-background.png",
    "assets/images/android-icon-foreground.png",
    "assets/images/android-icon-monochrome.png",
    "assets/images/favicon.png",
    "assets/images/icon.png",
    "assets/images/partial-react-logo.png",
    "assets/images/react-logo.png",
    "assets/images/react-logo@2x.png",
    "assets/images/react-logo@3x.png",
    "assets/images/splash-icon.png",
    "assets/manifest.json",
    "builderJson.json",
    "eslint.config.js",
    "expo-env.d.ts",
    "GEMINI.md",
    "package-lock.json",
    "package.json",
    "README.md",
    "src",
    "src/app",
    "src/app/ShellApp.tsx",
    "src/core",
    "src/core/api.ts",
    "src/core/device.ts",
    "src/core/events.ts",
    "src/core/manifest.ts",
    "src/core/navigation.ts",
    "src/core/types.ts",
    "src/generated",
    "src/generated/registry.ts",
    "src/generated/scr_home.tsx",
    "src/generated/scr_meal_capture.tsx",
    "src/generated/scr_meal_confirm.tsx",
    "src/generated/scr_meal_history.tsx",
    "src/generated/scr_nutrition_advice.tsx",
    "src/generated/scr_weekly_report.tsx",
    "src/screens",
    "src/screens/FallbackScreen.tsx",
    "tsconfig.json"
  ],
  "analysis": {
    "project": {
      "language": "TypeScript",
      "framework": "Expo/React Native",
      "structure": "Monorepo with distinct API and device services, modular screen components, central navigation and state management"
    },
    "patterns": {
      "naming": {
        "files": "PascalCase for components, lowerCamelCase for utilities",
        "functions": "lowerCamelCase",
        "classes": "PascalCase"
      },
      "architecture": {
        "services": "Service functions are created using hooks (useNav) and factory functions (createApi, createDevice)",
        "models": "Interfaces and type definitions are in \u0060src/core/types.ts\u0060",
        "api": "Centralized API calls through \u0060createApi\u0060 with mock logic, extensible for real HTTP requests"
      },
      "testing": {
        "framework": "No explicit test framework found",
        "structure": "Tests might be co-located with components or in a \u0060/tests\u0060 directory (not present)",
        "commands": "No test commands found in package.json"
      }
    },
    "similar_implementations": [
      {
        "file": "src/core/api.ts",
        "relevance": "Handles API call logic with mock data, similar logic might be used for other service integrations.",
        "pattern": "Factory function pattern with mock data responses."
      }
    ],
    "libraries": [
      {
        "name": "expo",
        "usage": "Toolkit for React Native apps",
        "patterns": "Used in configuration scripts, Expo-specific APIs like Image Picker."
      },
      {
        "name": "@react-navigation/native",
        "usage": "Navigation within the app",
        "patterns": "useNav custom hook appears to enhance React Navigation."
      },
      {
        "name": "react-native",
        "usage": "Base library for native app development",
        "patterns": "Used alongside Expo for React Native components."
      }
    ],
    "validation_commands": {
      "syntax": "npm run lint",
      "test": "Tests are not explicitly defined in the fetched files",
      "run": "npx expo start"
    }
  }
}
```