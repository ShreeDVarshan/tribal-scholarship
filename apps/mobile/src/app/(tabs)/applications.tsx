import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { demoStudentData } from '@/constants/demoData';
import { router } from 'expo-router';
import { Clock, CheckCircle2, ChevronRight, FileText } from 'lucide-react-native';

export default function ApplicationsScreen() {
  const [filter, setFilter] = useState('ALL');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Applications</Text>
        <Text style={styles.subtitle}>Consolidated status tracker across all 5 scholarship rails</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {['ALL', 'ACTIVE', 'COMPLETED'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, filter === tab && styles.tabBtnActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.list}>
        {/* Active Application */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/applications/app-post-matric-1')}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.schemeName}>Post-Matric Scholarship for ST Students</Text>
              <Text style={styles.appNumber}>APP-2024-91823 • AY 2024-2025</Text>
            </View>
            <View style={styles.statusBadge}>
              <Clock size={12} color="#1D4ED8" />
              <Text style={styles.statusBadgeText}>Under Review</Text>
            </View>
          </View>

          <View style={styles.stageIndicator}>
            <Text style={styles.stageLabel}>Current Stage:</Text>
            <Text style={styles.stageVal}>Department Scrutiny (Dist. Office Coimbatore)</Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.updatedAt}>Submitted on 20 Jul 2024</Text>
            <View style={styles.trackLink}>
              <Text style={styles.trackLinkText}>View Timeline</Text>
              <ChevronRight size={14} color={colors.primary} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Historical Disbursed Application */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/applications/app-post-matric-1')}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.schemeName}>Pre-Matric Scholarship for ST Students</Text>
              <Text style={styles.appNumber}>APP-2022-11948 • AY 2021-2022</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.primaryLight }]}>
              <CheckCircle2 size={12} color={colors.primary} />
              <Text style={[styles.statusBadgeText, { color: colors.primary }]}>Disbursed</Text>
            </View>
          </View>

          <View style={styles.stageIndicator}>
            <Text style={styles.stageLabel}>Disbursed Amount:</Text>
            <Text style={styles.stageVal}>₹14,000 via DBT (Credited)</Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.updatedAt}>Completed cycle</Text>
            <View style={styles.trackLink}>
              <Text style={styles.trackLinkText}>View Archived Record</Text>
              <ChevronRight size={14} color={colors.primary} />
            </View>
          </View>
        </TouchableOpacity>
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
    paddingBottom: 90,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.charcoal,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  schemeName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.charcoal,
  },
  appNumber: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  stageIndicator: {
    marginTop: 12,
    padding: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
  },
  stageLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  stageVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.charcoal,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  updatedAt: {
    fontSize: 11,
    color: colors.textMuted,
  },
  trackLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trackLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
