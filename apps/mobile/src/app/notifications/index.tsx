import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { ArrowLeft, Bell, CheckCircle2, Clock, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  const notifs = [
    {
      title: 'Income Certificate Expiry Notice',
      body: 'Your income certificate expires on 15 Nov 2024. Please apply for a renewal soon to prevent scholarship payment delays.',
      time: '2 hours ago',
      type: 'ALERT',
    },
    {
      title: 'Application Forwarded to Department',
      body: 'Your Post-Matric application (APP-2024-91823) has cleared Institution Verification and is now with the Tribal Welfare Department.',
      time: '2 days ago',
      type: 'UPDATE',
    },
    {
      title: 'Previous DBT Disbursement Confirmed',
      body: '₹42,000 was successfully disbursed to SBI account ending in ****4521 for Academic Year 2023-2024.',
      time: '15 Mar 2024',
      type: 'PAYMENT',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications & Alerts</Text>
      </View>

      <View style={styles.list}>
        {notifs.map((n, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{n.title}</Text>
              <Text style={styles.cardTime}>{n.time}</Text>
            </View>
            <Text style={styles.cardBody}>{n.body}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.charcoal,
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
    flex: 1,
  },
  cardTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  cardBody: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
