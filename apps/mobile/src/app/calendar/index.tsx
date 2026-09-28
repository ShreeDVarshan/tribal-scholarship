import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { ArrowLeft, Calendar as CalIcon, Clock, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function CalendarScreen() {
  const events = [
    { date: '15 Oct 2024', title: 'Income Certificate Expiry Notice', type: 'DEADLINE', tag: 'Renewal Required' },
    { date: '31 Oct 2024', title: 'Post-Matric Institutional Verification Deadline', type: 'CYCLE', tag: 'Nodal Officer Action' },
    { date: '15 Nov 2024', title: 'Top Class Scholarship Cycle Window Closure', type: 'CYCLE', tag: 'SFMP Portal' },
    { date: '01 Dec 2024', title: 'Anticipated Central DBT Release (Q3 Installment)', type: 'PAYMENT', tag: 'PFMS Rail' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Scholarship Milestones</Text>
          <Text style={styles.headerSubtitle}>Personalized timeline & statutory deadlines</Text>
        </View>
      </View>

      <View style={styles.list}>
        {events.map((ev, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.dateCol}>
              <CalIcon size={16} color={colors.primary} />
              <Text style={styles.dateText}>{ev.date}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.titleText}>{ev.title}</Text>
              <Text style={styles.tagText}>● {ev.tag}</Text>
            </View>
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
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
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
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  dateCol: {
    alignItems: 'center',
    width: 80,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingRight: 8,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.charcoal,
  },
  tagText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
