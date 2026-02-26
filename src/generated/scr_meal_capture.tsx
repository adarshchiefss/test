import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, TextInput } from "react-native";
import type { ScreenComponentProps } from "../core/types";

export default function MealCaptureScreen(props: ScreenComponentProps) {
  const { screen, nav, api, device, emit } = props;
  
  const [mealType, setMealType] = useState("breakfast");
  const [consumedAt, setConsumedAt] = useState(() => new Date().toISOString());
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loadingPick, setLoadingPick] = useState(false);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickPhoto = async () => {
    try {
      setLoadingPick(true);
      setError(null);
      const base64 = await device.pickImageBase64();
      setImageBase64(base64);
      emit("on_pick_photo", { has_image: true });
    } catch (e: any) {
      setError(e.message || "Failed to pick image");
    } finally {
      setLoadingPick(false);
    }
  };

  const handleAnalyze = async () => {
    if (!imageBase64 || !screen.agent_id) return;
    try {
      setLoadingAnalyze(true);
      setError(null);
      emit("on_analyze", { meal_type: mealType, consumed_at: consumedAt });
      
      const result = await api.call(screen.agent_id, { 
        image_base64: imageBase64, 
        meal_type: mealType, 
        consumed_at: consumedAt 
      });
      
      emit("on_analyze_success", { meal_type: mealType, consumed_at: consumedAt });
      nav.go("meal_confirm", { 
        draft: result.draft || result, 
        image_base64: imageBase64, 
        meal_type: mealType, 
        consumed_at: consumedAt 
      });
    } catch (e: any) {
      setError(e.message || "Failed to analyze image");
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const handleBack = () => {
    emit("on_back");
    nav.resolve("on_back");
  };

  const mealTypeOptions = screen.props?.fields?.find((f: any) => f.name === 'meal_type')?.options || ["breakfast", "lunch", "dinner", "snack"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable testID="btn_back" onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{screen.title}</Text>
      </View>

      <Text style={styles.instructions}>{screen.props?.instructions?.join("\n")}</Text>

      {error && <Text testID="txt_error" style={styles.errorText}>{error}</Text>}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Meal Type</Text>
        <View style={styles.radioGroup}>
          {mealTypeOptions.map((opt: string) => (
            <Pressable key={opt} style={[styles.radio, mealType === opt && styles.radioSelected]} onPress={() => setMealType(opt)}>
              <Text style={mealType === opt ? styles.radioTextSelected : styles.radioText}>{opt}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Consumed At (ISO)</Text>
        <TextInput 
          style={styles.input} 
          value={consumedAt} 
          onChangeText={setConsumedAt} 
        />
      </View>

      <Pressable testID="btn_pick_photo" style={styles.button} onPress={handlePickPhoto} disabled={loadingPick || loadingAnalyze}>
        {loadingPick ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Pick Meal Photo</Text>}
      </Pressable>

      {imageBase64 && (
        <View style={styles.previewBox}>
          <Text style={styles.previewText}>Image selected ({imageBase64.length} chars)</Text>
        </View>
      )}

      <Pressable 
        testID="btn_analyze" 
        style={[styles.button, styles.primaryButton, (!imageBase64 || loadingPick || loadingAnalyze) && styles.buttonDisabled]} 
        onPress={handleAnalyze} 
        disabled={!imageBase64 || loadingPick || loadingAnalyze}
      >
        {loadingAnalyze ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Analyze</Text>}
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
  instructions: { fontSize: 14, color: '#666', marginBottom: 24, lineHeight: 20 },
  errorText: { color: 'red', marginBottom: 12 },
  formGroup: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  radioGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  radio: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 16, backgroundColor: '#fff' },
  radioSelected: { backgroundColor: '#2F80ED', borderColor: '#2F80ED' },
  radioText: { color: '#333' },
  radioTextSelected: { color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: '#555', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  primaryButton: { backgroundColor: '#2F80ED' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  previewBox: { backgroundColor: '#e0e0e0', padding: 24, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  previewText: { color: '#555' }
});
