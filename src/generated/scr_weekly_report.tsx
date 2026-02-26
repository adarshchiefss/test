import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, TextInput } from "react-native";
import type { ScreenComponentProps } from "../core/types";

export default function WeeklyReportScreen(props: ScreenComponentProps) {
  const { screen, nav, api, emit } = props;
  
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  
  const [weekStart, setWeekStart] = useState(lastWeek.toISOString().split('T')[0]);
  const [weekEnd, setWeekEnd] = useState(today.toISOString().split('T')[0]);
  
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!screen.agent_id) return;
    try {
      setLoading(true);
      setError(null);
      emit("on_generate", { week_start: weekStart, week_end: weekEnd });
      
      const result = await api.call(screen.agent_id, { week_start: weekStart, week_end: weekEnd });
      setReport(result);
    } catch (e: any) {
      setError(e.message || "Failed to generate report");
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

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput testID="txt_week_start" style={styles.input} value={weekStart} onChangeText={setWeekStart} placeholder="YYYY-MM-DD" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>End Date</Text>
          <TextInput testID="txt_week_end" style={styles.input} value={weekEnd} onChangeText={setWeekEnd} placeholder="YYYY-MM-DD" />
        </View>
      </View>

      <Pressable testID="btn_generate_report" style={[styles.button, loading && styles.buttonDisabled]} onPress={handleGenerate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Generate Report</Text>}
      </Pressable>

      {error && <Text testID="txt_error" style={styles.errorText}>{error}</Text>}

      {report && (
        <View style={styles.reportContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Totals & Averages</Text>
            <Text style={styles.textItem}>Total Calories: {report.total_calories_kcal} kcal</Text>
            <Text style={styles.textItem}>Avg Daily Calories: {report.avg_daily_calories_kcal} kcal</Text>
            <Text style={styles.textItem}>Total Protein: {report.total_protein_g}g</Text>
            <Text style={styles.textItem}>Total Carbs: {report.total_carbs_g}g</Text>
            <Text style={styles.textItem}>Total Fat: {report.total_fat_g}g</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            <Text style={styles.textItem}>Best Day: {report.best_day}</Text>
            <Text style={styles.subtitle}>Needs Attention:</Text>
            {report.needs_attention?.map((item: string, idx: number) => (
              <Text key={idx} style={styles.bulletItem}>• {item}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Breakdown</Text>
            {report.days?.map((day: any, idx: number) => (
              <View key={idx} style={styles.dayRow}>
                <Text style={styles.dayDate}>{day.date}</Text>
                <Text style={styles.dayStats}>{day.calories_kcal} kcal | P: {day.protein_g}g C: {day.carbs_g}g F: {day.fat_g}g</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backButton: { marginRight: 16, padding: 8 },
  backText: { color: '#2F80ED', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  inputContainer: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4, color: '#555' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  button: { backgroundColor: '#2F80ED', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', marginBottom: 16, textAlign: 'center' },
  reportContainer: { paddingBottom: 32 },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  subtitle: { fontSize: 16, fontWeight: '600', marginTop: 8, marginBottom: 4, color: '#444' },
  textItem: { fontSize: 15, color: '#555', marginBottom: 4 },
  bulletItem: { fontSize: 15, color: '#666', marginLeft: 8, marginBottom: 2 },
  dayRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  dayDate: { fontWeight: '600', color: '#333' },
  dayStats: { color: '#666', fontSize: 13 }
});
