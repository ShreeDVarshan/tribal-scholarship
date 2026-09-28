import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle2, ShieldCheck, ArrowRight, FileCheck } from 'lucide-react-native';

export default function ApplicationWizardScreen() {
  const { schemeId } = useLocalSearchParams();
  const [step, setStep] = useState(1);
  const [isDeclared, setIsDeclared] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reusableDocs = [
    { name: 'ST Community Certificate', authority: 'e-District TN', status: 'VERIFIED' },
    { name: 'Income Certificate (FY 24-25)', authority: 'Revenue Dept', status: 'VERIFIED' },
    { name: 'Semester 4 Marksheet', authority: 'APAAR / DigiLocker', status: 'VERIFIED' },
    { name: 'Aadhaar Identity Proof', authority: 'UIDAI Demo', status: 'VERIFIED' },
    { name: 'Bank Passbook Mandate', authority: 'PFMS / DBT Active', status: 'VERIFIED' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>One-Click Application Wizard</Text>
          <Text style={styles.headerSubtitle}>Post-Matric Scholarship for ST Students</Text>
        </View>
      </View>

      {/* Wizard Progress Bar */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperBar}>
          <View style={[styles.stepperFill, { width: `${(step / 4) * 100}%` }]} />
        </View>
        <Text style={styles.stepIndicator}>Step {step} of 4: {
          step === 1 ? 'Profile Verification' :
          step === 2 ? 'Document Auto-Reuse' :
          step === 3 ? 'Review & Declaration' : 'Application Dispatched'
        }</Text>
      </View>

      {step === 1 && (
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>1. Confirm Profile Attributes</Text>
          <Text style={styles.stepDesc}>Information fetched from your verified One Profile is populated automatically.</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Applicant Name:</Text>
            <Text style={styles.infoVal}>Arjun Kumar</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category & Sub-tribe:</Text>
            <Text style={styles.infoVal}>Scheduled Tribe (ST) - Verified</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Enrolled Institution:</Text>
            <Text style={styles.infoVal}>Govt Arts & Science College, Coimbatore</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Disbursement Account:</Text>
            <Text style={styles.infoVal}>SBI ****4521 (Aadhaar Seeding Active)</Text>
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
            <Text style={styles.nextBtnText}>Confirm Profile & Proceed</Text>
            <ArrowRight size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepCard}>
          <View style={styles.reusableBanner}>
            <ShieldCheck size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.reusableBannerTitle}>Zero Redundant Uploads</Text>
              <Text style={styles.reusableBannerDesc}>
                These verified documents from your One Profile wallet are automatically bundled with your application.
              </Text>
            </View>
          </View>

          <View style={styles.docList}>
            {reusableDocs.map((doc, i) => (
              <View key={i} style={styles.docItem}>
                <FileCheck size={16} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docAuthority}>Source: {doc.authority}</Text>
                </View>
                <View style={styles.reusedBadge}>
                  <Text style={styles.reusedBadgeText}>REUSED</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)}>
            <Text style={styles.nextBtnText}>Accept Bundled Documents</Text>
            <ArrowRight size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>3. Undertaking & Declaration</Text>
          <Text style={styles.stepDesc}>Please confirm the truthfulness of the provided particulars.</Text>

          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => setIsDeclared(!isDeclared)}
          >
            <View style={[styles.checkbox, isDeclared && styles.checkboxActive]}>
              {isDeclared && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              I solemnly declare that I am an ST student of regular attendance, that the family annual income is true to the certified records, and that I am not in receipt of any other conflicting scholarship from Central or State sources.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.nextBtn, !isDeclared && styles.nextBtnDisabled]} 
            disabled={!isDeclared}
            onPress={() => {
              setStep(4);
              setIsSubmitted(true);
            }}
          >
            <Text style={styles.nextBtnText}>Submit Formal Application</Text>
            <ArrowRight size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {step === 4 && (
        <View style={[styles.stepCard, { alignItems: 'center', textAlign: 'center' }]}>
          <View style={styles.successIcon}>
            <CheckCircle2 size={40} color={colors.primary} />
          </View>
          <Text style={styles.successTitle}>Application Transmitted Successfully!</Text>
          <Text style={styles.appRef}>Application Reference: APP-2024-91823</Text>
          <Text style={styles.successDesc}>
            Your file has been lodged on the unified scholarship management rail. Your college nodal officer and state authorities can now scrutinize it without requesting duplicate submissions.
          </Text>

          <TouchableOpacity 
            style={[styles.nextBtn, { width: '100%', marginTop: 20 }]} 
            onPress={() => router.push('/applications')}
          >
            <Text style={styles.nextBtnText}>Track Application Stage</Text>
          </TouchableOpacity>
        </View>
      )}
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
  stepperContainer: {
    marginBottom: 20,
  },
  stepperBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  stepperFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  stepIndicator: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.charcoal,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 17,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.charcoal,
  },
  nextBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 20,
  },
  nextBtnDisabled: {
    backgroundColor: colors.borderStrong,
  },
  nextBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reusableBanner: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  reusableBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  reusableBannerDesc: {
    fontSize: 11,
    color: colors.charcoal,
    marginTop: 2,
    lineHeight: 15,
  },
  docList: {
    gap: 10,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  docName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.charcoal,
  },
  docAuthority: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  reusedBadge: {
    backgroundColor: '#E8F4F2',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  reusedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.secondary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  checkboxText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 17,
    flex: 1,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.charcoal,
    textAlign: 'center',
  },
  appRef: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  successDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
});
