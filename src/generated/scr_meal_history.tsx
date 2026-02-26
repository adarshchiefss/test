import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from "react-native";
import type { ScreenComponentProps } from "../core/types";

export default function MealHistoryScreen(props: ScreenComponentProps) {
  const { screen, nav, api, emit } = props;
  
  const [dateRange, setDateRange] = useState("7d");
  const [meals, setMeals] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = async () => {
    if (!screen.agent_id) return;
    try {
      setLoading(true);
      setError(null);
      const result = await api.call(screen.agent_id, { date_range: dateRange });
      setMeals(result.meals || []);
    } catch (e: any) {
      setError(e.message || "Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [dateRange]);

  const handleRefresh = () => {
    emit("on_refresh");
    fetchMeals();
  };

  const handleSelect = (meal: any) => {
    emit("on_select:meal", { meal_id: meal.meal_id });
    setSelectedMeal(meal);
  };

  const handleBack = () => {
    emit("on_back");
    nav.resolve("on_back");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable testID="btn_back" onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{screen.title}</Text>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.label}>Date Range:</Text>
        <View testID="picker_date_range" style={styles.radioGroup}>
          {["today", "7d", "30d"].map(opt => (
            <Pressable key={opt} style={[styles.radio, dateRange === opt && styles.radioSelected]} onPress={() => setDateRange(opt)}>
              <Text style={dateRange === opt ? styles.radioTextSelected : styles.radioText}>{opt}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable testID="btn_refresh" style={styles.refreshButton} onPress={handleRefresh} disabled={loading}>
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      {error && <Text testID="txt_error" style={styles.errorText}>{error}</Text>}

      {loading && meals.length === 0 ? (
        <ActivityIndicator size="large" color="#2F80ED" style={styles.loader} />
      ) : (
        <FlatList
          testID="list_meals"
          data={meals}
          keyExtractor={item => item.meal_id || Math.random().toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.listItem} onPress={() => handleSelect(item)}>
              <View style={styles.listMain}>
                <Text style={styles.listTitle}>{item.food_name}</Text>
                <Text style={styles.listSubtitle}>{item.consumed_at} • {item.meal_type}</Text>
              </View>
              <Text style={styles.listRight}>{item.calories_kcal} kcal</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No meals found</Text>}
        />
      )}

      {selectedMeal && (
        <View style={styles.detailPanel}>
          <Text style={styles.detailTitle}>{selectedMeal.food_name} Details</Text>
          <Text style={styles.detailText}>Calories: {selectedMeal.calories_kcal} kcal</Text>
          <Text style={styles.detailText}>Protein: {selectedMeal.protein_g}g | Carbs: {selectedMeal.carbs_g}g | Fat: {selectedMeal.fat_g}g</Text>
          <Pressable style={styles.closeDetailButton} onPress={() => setSelectedMeal(null)}>
            <Text style={styles.closeDetailText}>Close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backButton: { marginRight: 16, padding: 8 },
  backText: { color: '#2F80ED', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginRight: 8 },
  radioGroup: { flexDirection: 'row', gap: 4 },
  radio: { paddingVertical: 4, paddingHorizontal: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, backgroundColor: '#fff' },
  radioSelected: { backgroundColor: '#2F80ED', borderColor: '#2F80ED' },
  radioText: { fontSize: 12, color: '#333' },
  radioTextSelected: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
  refreshButton: { padding: 8 },
  refreshText: { color: '#2F80ED', fontWeight: '600' },
  errorText: { color: 'red', marginBottom: 12 },
  loader: { marginTop: 32 },
  list: { flex: 1 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, marginBottom: 8, borderRadius: 8, elevation: 1 },
  listMain: { flex: 1, marginRight: 12 },
  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  listSubtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  listRight: { fontSize: 16, fontWeight: '600', color: '#2F80ED' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 32 },
  detailPanel: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderColor: '#ddd', marginTop: 16, borderRadius: 8, elevation: 4 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  detailText: { fontSize: 14, color: '#555', marginBottom: 4 },
  closeDetailButton: { marginTop: 12, alignSelf: 'flex-end', padding: 8 },
  closeDetailText: { color: '#2F80ED', fontWeight: 'bold' }
});
