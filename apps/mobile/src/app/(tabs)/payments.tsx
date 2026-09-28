import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { demoStudentData } from '@/constants/demoData';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowDownLeft } from 'lucide-react-native';

export default function PaymentsScreen() {
  const p = demoStudentData.recentPayment;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Direct Benefit Transfer (DBT)</Text>
        <Text style={styles.subtitle}>Verified bank linkage & disbursement ledger</Text>
      </View>

      {/* Account Verification Card */}
      <View style={styles.accountCard}>
        <View style={styles.accountCardTop}>
          <CreditCard size={20} color={colors.primary} />
          <View style={styles.verifiedTag}>
            <CheckCircle2 size={12} color={colors.primary} />
            <Text style={styles.verifiedTagText}>DBT SEEDED & ACTIVE</Text>
          </View>
        </View>
        <Text style={styles.bankName}>{demoStudentData.bankName}</Text>
        <Text style={styles.accountNum}>Account: {demoStudentData.bankAccountMasked} (Aadhaar Linked)</Text>
        <Text style={styles.accountNote}>Scholarship disbursements are routed directly via PFMS/NPCI rail.</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Disbursed</Text>
          <Text style={styles.statVal}>₹56,000</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Pending Sanctions</Text>
          <Text style={styles.statVal}>₹0</Text>
        </View>
      </View>

      {/* Transactions List */}
      <Text style={styles.sectionTitle}>TRANSACTION HISTORY (DEMO)</Text>

      <View style={styles.txList}>
        <View style={styles.txCard}>
          <View style={styles.txIcon}>
            <ArrowDownLeft size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.txScheme}>{p.scheme}</Text>
            <Text style={styles.txMeta}>{p.cycle} • Ref: {p.ref}</Text>
            <Text style={styles.txDate}>{p.date}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.txAmount}>+₹{p.amount.toLocaleString('en-IN')}</Text>
            <View style={styles.paidChip}>
              <Text style={styles.paidChipText}>CREDITED</Text>
            </View>
          </View>
        </View>

        <View style={styles.txCard}>
          <View style={styles.txIcon}>
            <ArrowDownLeft size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.txScheme}>Pre-Matric Scholarship</Text>
            <Text style={styles.txMeta}>Academic Year 2021-2022 • Ref: JSS***1194</Text>
            <Text style={styles.txDate}>20 Nov 2022</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.txAmount}>+₹14,000</Text>
            <View style={styles.paidChip}>
              <Text style={styles.paidChipText}>CREDITED</Text>
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
  accountCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  accountCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
  },
  bankName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.charcoal,
  },
  accountNum: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  accountNote: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.charcoal,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  txList: {
    gap: 10,
  },
  txCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txScheme: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
  },
  txMeta: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  txDate: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  paidChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 3,
  },
  paidChipText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primary,
  },
});
