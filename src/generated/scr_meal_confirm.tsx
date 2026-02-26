import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, TextInput } from "react-native";
import type { ScreenComponentProps } from "../core/types";

export default function MealConfirmScreen(props: ScreenComponentProps) {
  const { screen, nav, api, emit } = props;
  const params = nav.params ?? {};
  const draft = params.draft ?? {};

  const [foodName, setFoodName] = useState(draft.food_name || "");
  const [servingNotes, setServingNotes] = useState(draft.serving_notes || "");
  const [caloriesKcal, setCaloriesKcal] = useState(draft.calories_kcal?.toString() || "0");
  const [proteinG, setProteinG] = useState(draft.protein_g?.toString() || "0");
  const [carbsG, setCarbsG] = useState(draft.carbs_g?.toString() || "0");
  const [fatG, setFatG] = useState(draft.fat_g?.toString() || "0");
  const [fiberG, setFiberG] = useState(draft.fiber_g?.toString() || "0");
  const [sugarG, setSugarG] = useState(draft.sugar_g?.toString() || "0");
  const [sodiumMg, setSodiumMg] = useState(draft.sodium_mg?.toString() || "0");

  const mealType = params.meal_type || draft.meal_type || "";
  const consumedAt = params.consumed_at || draft.consumed_at || "";
  const imageBase64 = params.image_base64;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!screen.agent_id) return;
    try {
      setLoading(true);
      setError(null);
      emit("on_save", { meal_type: mealType, consumed_at: consumedAt });
      
      const payload = {
        meal_type: mealType,
        consumed_at: consumedAt,
        image_base64: imageBase64,
        food_name: foodName,
        serving_notes: servingNotes,
        calories_kcal: Number(caloriesKcal),
        protein_g: Number(proteinG),
        carbs_g: Number(carbsG),
        fat_g: Number(fatG),
        fiber_g: Number(fiberG),
        sugar_g: Number(sugarG),
        sodium_mg: Number(sodiumMg),
        confidence: draft.confidence ?? null,
        warnings: draft.warnings ?? []
      };

      const result = await api.call(screen.agent_id, payload);
      emit("on_save_success", { meal_id: result.meal_id });
      nav.go("meal_history", { highlight_meal_id: result.meal_id });
    } catch (e: any) {
      setError(e.message || "Failed to save meal");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    emit("on_back");
    nav.resolve("on_back");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable testID="btn_back" onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{screen.title}</Text>
      </View>

      {error && <Text testID="txt_error" style={styles.errorText}>{error}</Text>}

      {imageBase64 && (
        <View style={styles.photoSection}>
          <Text style={styles.photoText}>Photo attached</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meal Details</Text>
        <Text style={styles.readOnlyText}>Type: {mealType}</Text>
        <Text style={styles.readOnlyText}>Time: {consumedAt}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estimated Nutrition</Text>
        
        <Text style={styles.label}>Food Name</Text>
        <TextInput testID="txt_food_name" style={styles.input} value={foodName} onChangeText={setFoodName} />
        
        <Text style={styles.label}>Serving Notes</Text>
        <TextInput testID="txt_serving_notes" style={styles.input} value={servingNotes} onChangeText={setServingNotes} />
        
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Calories (kcal)</Text>
            <TextInput testID="txt_calories_kcal" style={styles.input} value={caloriesKcal} onChangeText={setCaloriesKcal} keyboardType="numeric" />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Protein (g)</Text>
            <TextInput testID="txt_protein_g" style={styles.input} value={proteinG} onChangeText={setProteinG} keyboardType="numeric" />
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Carbs (g)</Text>
            <TextInput testID="txt_carbs_g" style={styles.input} value={carbsG} onChangeText={setCarbsG} keyboardType="numeric" />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Fat (g)</Text>
            <TextInput testID="txt_fat_g" style={styles.input} value={fatG} onChangeText={setFatG} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Fiber (g)</Text>
            <TextInput testID="txt_fiber_g" style={styles.input} value={fiberG} onChangeText={setFiberG} keyboardType="numeric" />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Sugar (g)</Text>
            <TextInput testID="txt_sugar_g" style={styles.input} value={sugarG} onChangeText={setSugarG} keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.label}>Sodium (mg)</Text>
        <TextInput testID="txt_sodium_mg" style={styles.input} value={sodiumMg} onChangeText={setSodiumMg} keyboardType="numeric" />
      </View>

      <Pressable testID="btn_save_meal" style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Meal</Text>}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backButton: { marginRight: 16, padding: 8 },
  backText: { color: '#2F80ED', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  errorText: { color: 'red', marginBottom: 12 },
  photoSection: { backgroundColor: '#e0e0e0', padding: 16, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  photoText: { color: '#555', fontStyle: 'italic' },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  readOnlyText: { fontSize: 16, color: '#666', marginBottom: 4 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4, color: '#444' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: '#fafafa' },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  button: { backgroundColor: '#2F80ED', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 32 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
