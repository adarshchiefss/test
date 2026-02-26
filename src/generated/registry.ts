import type { ScreenComponentProps } from "../core/types";
import React from "react";
import FallbackScreen from "../screens/FallbackScreen";

import HomeScreen from "./scr_home";
import MealCaptureScreen from "./scr_meal_capture";
import MealConfirmScreen from "./scr_meal_confirm";
import MealHistoryScreen from "./scr_meal_history";
import WeeklyReportScreen from "./scr_weekly_report";
import NutritionAdviceScreen from "./scr_nutrition_advice";

export const REGISTRY: Record<string, React.ComponentType<ScreenComponentProps>> = {
  home: HomeScreen,
  meal_capture: MealCaptureScreen,
  meal_confirm: MealConfirmScreen,
  meal_history: MealHistoryScreen,
  weekly_report: WeeklyReportScreen,
  nutrition_advice: NutritionAdviceScreen,
};

export function getScreenComponent(screenId: string): React.ComponentType<ScreenComponentProps> {
  return REGISTRY[screenId] || FallbackScreen;
}
