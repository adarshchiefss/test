import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import type { ScreenComponentProps } from "../core/types";

export default function HomeScreen(props: ScreenComponentProps) {
  const { screen, nav, emit } = props;
  const [error, setError] = useState<string | null>(null);

  const handleCardPress = (card: any) => {
    try {
      emit(card.event, { card_id: card.id });
      nav.resolve(card.event);
    } catch (e: any) {
      setError(e.message || "Navigation failed");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screen.title}</Text>
        <Text style={styles.subtitle}>{screen.props?.subheader}</Text>
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.cardsContainer}>
        {screen.props?.cards?.map((card: any) => (
          <Pressable 
            key={card.id} 
            testID={`card_${card.id}`}
            style={styles.card}
            onPress={() => handleCardPress(card)}
          >
            <Text style={styles.cardLabel}>{card.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.summaryBlock}>
        <Text style={styles.summaryText}>Log meals to see trends</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  headerContainer: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  cardsContainer: { gap: 12 },
  card: { padding: 20, backgroundColor: '#fff', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardLabel: { fontSize: 18, fontWeight: '600', color: '#2F80ED' },
  errorText: { color: 'red', marginBottom: 12 },
  summaryBlock: { marginTop: 32, padding: 16, backgroundColor: '#e0e0e0', borderRadius: 8, alignItems: 'center' },
  summaryText: { fontSize: 14, color: '#555', fontStyle: 'italic' }
});
