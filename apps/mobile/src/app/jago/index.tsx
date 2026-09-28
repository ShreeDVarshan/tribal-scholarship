import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { ArrowLeft, Send, Sparkles, Bot, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';

interface Message {
  id: string;
  sender: 'user' | 'jago';
  text: string;
  time: string;
}

export default function JagoScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'jago',
      text: 'Namaste Arjun! I am JAGO, your personal scholarship guide on Janjathi Shiksha Setu. How can I assist you with your applications, documents, or eligibility today?',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQueries = [
    'Why is my application pending?',
    'What documents are missing?',
    'When was my last scholarship payment?',
    'Explain Post-Matric in simple words',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate intelligent context-aware reply
    setTimeout(() => {
      let replyText = '';
      const lower = query.toLowerCase();

      if (lower.includes('pending') || lower.includes('status')) {
        replyText = 'Your Post-Matric Scholarship application (APP-2024-91823) is currently with the District Tribal Welfare Department for final administrative scrutiny. Your institution verification was successfully cleared on 4 August. No action is required from you at this time.';
      } else if (lower.includes('document') || lower.includes('missing')) {
        replyText = 'You have 5 verified documents in your One Profile wallet (ST Certificate, Income Certificate, Marksheet, Aadhaar, and Bank Mandate). However, your Domicile Certificate is currently Pending verification, and your Income Certificate expires on 15 Nov 2024.';
      } else if (lower.includes('payment') || lower.includes('dbt')) {
        replyText = 'Your last scholarship disbursement was ₹42,000 via Direct Benefit Transfer (DBT) to your SBI account ending in ****4521 on 15 March 2024 for the 2023-2024 academic cycle.';
      } else {
        replyText = 'Post-Matric Scholarship helps ST college students pay their college tuition and living allowances. You apply once, and verified documents in your profile are reused automatically.';
      }

      const jagoMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'jago',
        text: replyText,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, jagoMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerAvatar}>
            <Bot size={18} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>JAGO AI Assistant</Text>
            <Text style={styles.headerSubtitle}>Personalized Scholarship Guide</Text>
          </View>
        </View>
      </View>

      {/* Mandatory Disclaimer */}
      <View style={styles.disclaimerBar}>
        <AlertTriangle size={13} color={colors.warning} />
        <Text style={styles.disclaimerText}>
          JAGO provides informational guidance. Official determinations are made by Ministry authorities.
        </Text>
      </View>

      {/* Chat Messages */}
      <ScrollView 
        style={styles.chatScroll} 
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.jagoBubble,
            ]}
          >
            {msg.sender === 'jago' && (
              <View style={styles.botIconSmall}>
                <Bot size={12} color={colors.primary} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.messageText, msg.sender === 'user' && styles.userMessageText]}>
                {msg.text}
              </Text>
              <Text style={[styles.timeText, msg.sender === 'user' && styles.userTimeText]}>
                {msg.time}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageBubble, styles.jagoBubble, { width: 100 }]}>
            <Text style={styles.typingText}>JAGO is typing...</Text>
          </View>
        )}
      </ScrollView>

      {/* Suggested Prompt Chips */}
      <View style={styles.suggestionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
          {suggestedQueries.map((q, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.suggestionChip}
              onPress={() => handleSend(q)}
            >
              <Sparkles size={11} color={colors.secondary} />
              <Text style={styles.suggestionText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask JAGO about schemes, status, documents..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity 
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} 
          onPress={() => handleSend()}
          disabled={!input.trim()}
        >
          <Send size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 6,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.charcoal,
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  disclaimerBar: {
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  disclaimerText: {
    fontSize: 10,
    color: colors.warning,
    fontWeight: '600',
    flex: 1,
    lineHeight: 14,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
  },
  jagoBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  botIconSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  messageText: {
    fontSize: 13,
    color: colors.charcoal,
    lineHeight: 18,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimeText: {
    color: '#D1E7DD',
  },
  typingText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
  },
  suggestionsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  inputContainer: {
    padding: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 13,
    backgroundColor: colors.surfaceMuted,
    color: colors.charcoal,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.borderStrong,
  },
});
