import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { demoStudentData } from '@/constants/demoData';
import { JourneyProgress } from '@/components/shared/JourneyProgress';
import { Logo } from '@/components/ui/Logo';
import { 
  Bell, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  FileCheck2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const student = demoStudentData;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.header}>
        <Logo size="md" />
        <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
          <Bell size={20} color={colors.charcoal} />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      {/* Greeting & Completion Card */}
      <View style={styles.greetingCard}>
        <View style={styles.greetingTop}>
          <View>
            <Text style={styles.greetingText}>Good evening,</Text>
            <Text style={styles.studentName}>{student.fullName}</Text>
            <View style={styles.studentTag}>
              <Text style={styles.studentTagText}>{student.role} • {student.district}</Text>
            </View>
          </View>
          <View style={styles.readinessScoreBadge}>
            <Text style={styles.readinessNumber}>{student.readinessScore}%</Text>
            <Text style={styles.readinessLabel}>Readiness</Text>
          </View>
        </View>

        {/* Profile Completion Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>One Profile Completion</Text>
            <Text style={styles.progressValue}>{student.profileCompletion}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${student.profileCompletion}%` }]} />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.profileActionRow}
          onPress={() => router.push('/readiness')}
        >
          <View style={styles.verifiedAttributes}>
            <ShieldCheck size={14} color={colors.primary} />
            <Text style={styles.verifiedText}>6 Verified Attributes • 4 Reusable Documents</Text>
          </View>
          <ChevronRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Signature Horizontal Journey Motif */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YOUR SCHOLARSHIP PATHWAY</Text>
        <JourneyProgress currentStage="VERIFICATION" />
      </View>

      {/* Active Application Card */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>ACTIVE APPLICATION</Text>
          <TouchableOpacity onPress={() => router.push('/applications')}>
            <Text style={styles.seeAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.appCardHeader}>
            <View>
              <Text style={styles.appSchemeTitle}>{student.activeApplication.shortName}</Text>
              <Text style={styles.appIdText}>ID: APP-2024-91823</Text>
            </View>
            <View style={styles.statusBadge}>
              <Clock size={12} color="#1D4ED8" />
              <Text style={styles.statusBadgeText}>Under Dept Verification</Text>
            </View>
          </View>

          <Text style={styles.appUpdateText}>{student.activeApplication.lastUpdate}</Text>

          <View style={styles.appCardFooter}>
            <Text style={styles.appTimeText}>{student.activeApplication.daysAgo}</Text>
            <TouchableOpacity 
              style={styles.trackBtn} 
              onPress={() => router.push('/applications/app-post-matric-1')}
            >
              <Text style={styles.trackBtnText}>Track Details</Text>
              <ArrowRight size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Next Action Item */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACTION REQUIRED</Text>
        <View style={[styles.card, styles.alertCard]}>
          <View style={styles.alertIconRow}>
            <AlertCircle size={20} color={colors.warning} />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>{student.nextAction.title}</Text>
              <Text style={styles.alertDesc}>{student.nextAction.desc}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.alertActionBtn}
            onPress={() => router.push('/documents')}
          >
            <Text style={styles.alertActionBtnText}>Review Document Wallet</Text>
            <ArrowRight size={13} color={colors.warning} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Opportunity / Scholarship Gap Alert */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SCHOLARSHIP OPPORTUNITY</Text>
        <View style={[styles.card, styles.opportunityCard]}>
          <View style={styles.alertIconRow}>
            <Sparkles size={20} color={colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.opportunityTitle}>{student.opportunity.title}</Text>
              <Text style={styles.opportunityDesc}>{student.opportunity.desc}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.opportunityBtn}
            onPress={() => router.push('/eligibility')}
          >
            <Text style={styles.opportunityBtnText}>Check Preliminary Eligibility</Text>
            <ArrowRight size={13} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Payment / DBT */}
      <View style={[styles.section, { marginBottom: 30 }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>RECENT DBT TRANSACTION</Text>
          <TouchableOpacity onPress={() => router.push('/payments')}>
            <Text style={styles.seeAllText}>Payment history</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.paymentRow}>
            <View>
              <Text style={styles.paymentAmount}>₹{student.recentPayment.amount.toLocaleString('en-IN')}</Text>
              <Text style={styles.paymentScheme}>{student.recentPayment.scheme}</Text>
              <Text style={styles.paymentMeta}>Ref: {student.recentPayment.ref} • {student.recentPayment.date}</Text>
            </View>
            <View style={styles.paidBadge}>
              <CheckCircle2 size={13} color={colors.primary} />
              <Text style={styles.paidBadgeText}>CREDITED</Text>
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  greetingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  greetingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.charcoal,
    marginTop: 2,
  },
  studentTag: {
    marginTop: 4,
  },
  studentTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  readinessScoreBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  readinessNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  readinessLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  progressContainer: {
    marginTop: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.charcoal,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  profileActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  verifiedAttributes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginTop: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appSchemeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.charcoal,
  },
  appIdText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'monospace',
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
  appUpdateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 10,
    lineHeight: 18,
  },
  appCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  appTimeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trackBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  alertCard: {
    backgroundColor: '#FFFDF9',
    borderColor: '#FDE68A',
  },
  alertIconRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
  },
  alertDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  alertActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  alertActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warning,
  },
  opportunityCard: {
    backgroundColor: '#F7FBFA',
    borderColor: '#BFE3DE',
  },
  opportunityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
  },
  opportunityDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  opportunityBtn: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  opportunityBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.charcoal,
  },
  paymentScheme: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  paymentMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paidBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
});
