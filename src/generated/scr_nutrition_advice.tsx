import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import type { ScreenComponentProps } from "../core/types";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string; created_at: string };

export default function NutritionAdviceScreen(props: ScreenComponentProps) {
  const { screen, nav, api, emit } = props;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || !screen.agent_id) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);
    setError(null);
    
    emit("on_submit", { text: textToSend });
    
    try {
      const result = await api.call(screen.agent_id, { text: textToSend, context_window_days: 14 });
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: result.advice_text,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      setError(e.message || "Failed to get advice");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    emit("on_back");
    nav.resolve("on_back");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.headerRow}>
        <Pressable testID="btn_back" onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{screen.title}</Text>
      </View>

      <View style={styles.quickPrompts}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {screen.props?.quick_prompts?.map((prompt: string, idx: number) => (
            <Pressable key={idx} style={styles.promptChip} onPress={() => setInputText(prompt)}>
              <Text style={styles.promptText}>{prompt}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
            <Text style={item.role === 'user' ? styles.roleLabelUser : styles.roleLabelAssistant}>
              {item.role === 'user' ? 'You' : 'Assistant'}
            </Text>
            <Text style={[styles.messageText, item.role === 'user' ? styles.userText : styles.assistantText]}>{item.text}</Text>
          </View>
        )}
      />

      {error && <Text testID="txt_error" style={styles.errorText}>{error}</Text>}

      <View style={styles.composer}>
        <TextInput 
          testID="txt_chat_input"
          style={styles.input} 
          value={inputText} 
          onChangeText={setInputText} 
          placeholder={screen.props?.composer?.placeholder || "Ask a question..."} 
          editable={!loading}
        />
        <Pressable 
          testID="btn_send"
          style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]} 
          onPress={() => handleSend(inputText)} 
          disabled={!inputText.trim() || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Send</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  backButton: { marginRight: 16, padding: 8 },
  backText: { color: '#2F80ED', fontSize: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  quickPrompts: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  promptChip: { backgroundColor: '#eef2ff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: '#d0d7ff' },
  promptText: { color: '#2F80ED', fontSize: 13 },
  messageList: { flex: 1, padding: 16 },
  messageBubble: { maxWidth: '85%', padding: 12, borderRadius: 12, marginBottom: 16 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#2F80ED', borderBottomRightRadius: 2 },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#eee' },
  roleLabelUser: { fontSize: 10, marginBottom: 4, opacity: 0.8, color: '#fff' },
  roleLabelAssistant: { fontSize: 10, marginBottom: 4, color: '#888' },
  messageText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#fff' },
  assistantText: { color: '#333' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 8 },
  composer: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendButton: { marginLeft: 12, backgroundColor: '#2F80ED', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }
});
