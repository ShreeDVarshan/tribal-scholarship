import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { demoStudentData } from '@/constants/demoData';
import { ArrowLeft, Clock, CheckCircle2, ShieldAlert, Building2, UserCheck, CreditCard } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ApplicationDetailScreen() {
  const stages = [
    {
      title: 'Application Submitted',
      date: '20 Jul 2024, 10:30 AM',
      desc: 'Transmitted electronically with 5 reused documents.',
      status: 'DONE',
    },
    {
      title: 'UIDAI Identity Match',
      date: '21 Jul 2024, 02:10 PM',
      desc: 'Aadhaar demographic authentication verified successfully.',
      status: 'DONE',
    },
    {
      title: 'Document Cross-Verification',
      date: '23 Jul 2024, 11:45 AM',
      desc: 'Community and income certificates matched with e-District repository.',
      status: 'DONE',
    },
    {
      title: 'Institution Verification',
      date: '04 Aug 2024, 04:20 PM',
      desc: 'Nodal Officer at Govt Arts College Coimbatore verified regular bonafide attendance.',
      status: 'DONE',
    },
    {
      title: 'Department Administrative Scrutiny',
      date: 'In Progress (Since 15 Aug 2024)',
      desc: 'Under review by District Tribal Welfare Office, Coimbatore. Next update expected within 5-7 working days.',
      status: 'CURRENT',
    },
    {
      title: 'State Sanction Order',
      date: 'Pending Scrutiny',
      desc: 'Formal financial sanction of eligible tuition and maintenance support.',
      status: 'UPCOMING',
    },
    {
      title: 'DBT Payment Disbursement',
      date: 'Pending Sanction',
      desc: 'Direct credit to student SBI account ending in ****4521 via PFMS rail.',
      status: 'UPCOMING',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Application Timeline</Text>
          <Text style={styles.headerSubtitle}>APP-2024-91823 • Post-Matric ST</Text>
        </View>
      </View>

      {/* Current Stage Highlight */}
      <View style={styles.currentStageCard}>
        <View style={styles.currentBadge}>
          <Clock size={12} color="#1D4ED8" />
          <Text style={styles.currentBadgeText}>CURRENT STAGE</Text>
        </View>
        <Text style={styles.currentStageTitle}>Department Verification</Text>
        <Text style={styles.currentStageDesc}>
          The application is with the District Tribal Welfare Officer, Coimbatore. No action is required from you.
        </Text>
      </View>

      {/* Timeline Steps */}
      <View style={styles.timelineList}>
        {stages.map((stage, idx) => {
          const isDone = stage.status === 'DONE';
          const isCurr = stage.status === 'CURRENT';

          return (
            <View key={idx} style={styles.timelineRow}>
              {/* Left Indicator */}
              <View style={styles.indicatorCol}>
                <View style={[
                  styles.node,
                  isDone && styles.nodeDone,
                  isCurr && styles.nodeCurr,
                ]}>
                  {isDone ? (
                    <Text style={styles.nodeIconDone}>✓</Text>
                  ) : (
                    <View style={[styles.innerDot, isCurr && styles.innerDotCurr]} />
                  )}
                </View>
                {idx < stages.length - 1 && (
                  <View style={[styles.vertLine, isDone && styles.vertLineDone]} />
                )}
              </View>

              {/* Right Content */}
              <View style={styles.contentCol}>
                <View style={styles.stepHeaderRow}>
                  <Text style={[styles.stepTitle, isCurr && styles.stepTitleCurr]}>{stage.title}</Text>
                  <Text style={styles.stepDate}>{stage.date}</Text>
                </View>
                <Text style={styles.stepDesc}>{stage.desc}</Text>
              </View>
            </View>
          );
        })}
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
    fontFamily: 'monospace',
  },
  currentStageCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#93C5FD',
    marginBottom: 20,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  currentStageTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.charcoal,
  },
  currentStageDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  timelineList: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 64,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  node: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  nodeDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  nodeCurr: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  nodeIconDone: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
  },
  innerDotCurr: {
    backgroundColor: '#FFFFFF',
  },
  vertLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  vertLineDone: {
    backgroundColor: colors.primary,
  },
  contentCol: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 16,
  },
  stepHeaderRow: {
    flexDirection: 'column',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.charcoal,
  },
  stepTitleCurr: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  stepDate: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  stepDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 15,
  },
});
