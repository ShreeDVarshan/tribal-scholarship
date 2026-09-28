import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { demoStudentData } from '@/constants/demoData';
import { router } from 'expo-router';
import { ArrowRight, Sparkles, CheckCircle2, Clock, AlertTriangle } from 'lucide-react-native';

export default function ScholarshipsScreen() {
  const schemes = demoStudentData.schemes;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Ministry Schemes</Text>
        <Text style={styles.subtitle}>5 unified Ministry of Tribal Affairs scholarships & fellowships</Text>
      </View>

      <TouchableOpacity 
        style={styles.checkerCard}
        onPress={() => router.push('/eligibility')}
      >
        <View style={styles.checkerIconRow}>
          <Sparkles size={20} color="#FFFFFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.checkerTitle}>Find Scholarships For Me</Text>
            <Text style={styles.checkerSubtitle}>Answer 4 simple questions for rule-based preliminary eligibility</Text>
          </View>
        </View>
        <View style={styles.checkerBtn}>
          <Text style={styles.checkerBtnText}>Run Checker</Text>
          <ArrowRight size={14} color={colors.primary} />
        </View>
      </TouchableOpacity>

      <View style={styles.list}>
        {schemes.map((scheme) => (
          <View key={scheme.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.schemeName}>{scheme.name}</Text>
                <Text style={styles.shortBadge}>{scheme.short}</Text>
              </View>
              <View style={[
                styles.badge,
                scheme.status === 'ACTIVE_APPLICATION' ? styles.badgeActive :
                scheme.status === 'LIKELY_ELIGIBLE' ? styles.badgeEligible :
                styles.badgeNeutral
              ]}>
                <Text style={[
                  styles.badgeText,
                  scheme.status === 'ACTIVE_APPLICATION' ? styles.badgeTextActive :
                  scheme.status === 'LIKELY_ELIGIBLE' ? styles.badgeTextEligible :
                  styles.badgeTextNeutral
                ]}>
                  {scheme.statusLabel}
                </Text>
              </View>
            </View>

            <Text style={styles.desc}>{scheme.desc}</Text>

            <View style={styles.cardFooter}>
              <div>
                <Text style={styles.amountLabel}>Benefit coverage</Text>
                <Text style={styles.amountText}>{scheme.amount}</Text>
              </div>

              <TouchableOpacity 
                style={styles.detailsBtn}
                onPress={() => router.push({ pathname: '/scholarships/[id]', params: { id: scheme.id } })}
              >
                <Text style={styles.detailsBtnText}>Scheme Details</Text>
                <ArrowRight size={14} color={colors.primary} />
              </TouchableOpacity>
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
  checkerCard: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  checkerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  checkerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  checkerSubtitle: {
    fontSize: 11,
    color: '#D1E7DD',
    marginTop: 1,
  },
  checkerBtn: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
  },
  checkerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  schemeName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.charcoal,
    lineHeight: 19,
  },
  shortBadge: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeActive: {
    backgroundColor: '#EFF6FF',
  },
  badgeTextActive: {
    color: '#1D4ED8',
    fontSize: 10,
    fontWeight: '700',
  },
  badgeEligible: {
    backgroundColor: colors.primaryLight,
  },
  badgeTextEligible: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  badgeNeutral: {
    backgroundColor: colors.surfaceMuted,
  },
  badgeTextNeutral: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  desc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  amountLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  amountText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.charcoal,
    marginTop: 1,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
