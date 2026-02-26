import type { Api } from "./types";

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

// This is intentionally simple.
// Replace mock logic with `fetch(BASE_URL + "/agent/" + route, ...)` later.
export function createApi(): Api {
  return {
    call: async (route: string, payload?: any) => {
      console.log("[api.call]", route, payload ?? "");

      // Simulate latency
      await sleep(400);

      // --- Mock responses for MVP demos ---
      if (route === "agent_log_meal") {
        // In real system, agent would analyze image, calculate macros, and write to DB
        return {
          ok: true,
          meal: {
            meal_id: `meal_${Date.now()}`,
            calories: 650,
            protein: 35,
            carbs: 70,
            fats: 20,
            created_at: new Date().toISOString(),
          },
        };
      }

      if (route === "agent_weekly_report") {
        return {
          ok: true,
          total_calories: 12850,
          avg_protein: 92,
          avg_carbs: 180,
          avg_fats: 55,
          narrative: "You were consistent this week. Consider increasing protein at breakfast.",
        };
      }

      if (route === "agent_set_goals") {
        return { ok: true, saved: true };
      }

      if (route === "agent_nutrition_advice") {
        return {
          ok: true,
          advice:
            "Based on your goal, prioritize lean protein and fiber. Reduce late-night sugary snacks.",
        };
      }

      // Default
      return { ok: true, route, payload };
    },
  };
}
