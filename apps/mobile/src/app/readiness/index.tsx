import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ReadinessScreen() {
  const items = [
    { title: 'Personal Information & State Domicile', status: 'VERIFIED', score: 100 },
    { title: 'ST Community Certification (e-District Match)', status: 'VERIFIED', score: 100 },
    { title: 'Academic Enrolment & Marksheet (APAAR)', status: 'VERIFIED', score: 100 },
    { title: 'Bank Account & Active Aadhaar DBT Linkage', status: 'VERIFIED', score: 100 },
    { title: 'Income Certificate Currency', status: 'EXPIRING_SOON', score: 40 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Application Readiness</Text>
          <Text style={styles.headerSubtitle}>Diagnostic preparedness index</Text>
        </View>
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreVal}>88%</Text>
        <Text style={styles.scoreLabel}>OVERALL APPLICATION READINESS</Text>
        <Text style={styles.scoreDesc}>
          Your profile qualifies for instant one-click applications. Address the pending item below to reach 100% readiness.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>COMPONENT DIAGNOSTICS</Text>

      <View style={styles.list}>
        {items.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSub}>Score: {item.score}/100</Text>
            </View>
            {item.status === 'VERIFIED' ? (
              <CheckCircle2 size={18} color={colors.primary} />
            ) : (
              <AlertTriangle size={18} color={colors.warning} />
            )}
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
  scoreCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreVal: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  scoreDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 10,
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.charcoal,
  },
  itemSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
