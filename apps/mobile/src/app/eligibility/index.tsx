import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import { ArrowLeft, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react-native';

export default function EligibilityCheckerScreen() {
  const [level, setLevel] = useState('COLLEGE');
  const [income, setIncome] = useState('UNDER_2_5L');
  const [isST, setIsST] = useState('YES');
  const [hasExisting, setHasExisting] = useState('NO');
  const [isEvaluated, setIsEvaluated] = useState(false);

  const handleEvaluate = () => {
    setIsEvaluated(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personalized Eligibility Check</Text>
      </View>

      <Text style={styles.disclaimerText}>
        Rule-based preliminary check. No official data is permanently submitted in this questionnaire.
      </Text>

      {!isEvaluated ? (
        <View style={styles.formSection}>
          {/* Question 1: Academic Level */}
          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>1. What is your current academic stage?</Text>
            <View style={styles.optionsGrid}>
              {[
                { id: 'SCHOOL', label: 'School (Class 9 - 10)' },
                { id: 'COLLEGE', label: 'College / UG / PG / ITI' },
                { id: 'RESEARCH', label: 'Ph.D. / Research Scholar' },
                { id: 'OVERSEAS', label: 'Pursuing Studies Abroad' },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optBtn, level === opt.id && styles.optBtnSelected]}
                  onPress={() => setLevel(opt.id)}
                >
                  <Text style={[styles.optText, level === opt.id && styles.optTextSelected]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Question 2: Income */}
          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>2. Annual family household income:</Text>
            <View style={styles.optionsGrid}>
              {[
                { id: 'UNDER_2_5L', label: 'Up to ₹2,50,000 / year' },
                { id: 'UNDER_6L', label: 'Between ₹2.5L and ₹6.0L / year' },
                { id: 'ABOVE_6L', label: 'Above ₹6,00,000 / year' },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optBtn, income === opt.id && styles.optBtnSelected]}
                  onPress={() => setIncome(opt.id)}
                >
                  <Text style={[styles.optText, income === opt.id && styles.optTextSelected]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Question 3: ST Community */}
          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>3. Do you hold a valid Scheduled Tribe (ST) Certificate?</Text>
            <View style={styles.optionsRow}>
              {[
                { id: 'YES', label: 'Yes, Valid Certificate Available' },
                { id: 'NO', label: 'No / In Process' },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optBtn, { flex: 1 }, isST === opt.id && styles.optBtnSelected]}
                  onPress={() => setIsST(opt.id)}
                >
                  <Text style={[styles.optText, isST === opt.id && styles.optTextSelected]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.checkSubmitBtn} onPress={handleEvaluate}>
            <Sparkles size={16} color="#FFFFFF" />
            <Text style={styles.checkSubmitText}>Evaluate My Entitlement</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Results Section */
        <View style={styles.resultsSection}>
          <View style={styles.resultBanner}>
            <CheckCircle2 size={24} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.resultBannerTitle}>Preliminary Assessment Complete</Text>
              <Text style={styles.resultBannerSubtitle}>Based on rules configured in the Central Eligibility Engine</Text>
            </View>
          </View>

          {/* Evaluated Scheme 1: Post Matric */}
          <View style={styles.resultCard}>
            <View style={styles.resultCardTop}>
              <Text style={styles.resultSchemeName}>Post-Matric Scholarship for ST Students</Text>
              <View style={styles.eligibleBadge}>
                <Text style={styles.eligibleBadgeText}>LIKELY ELIGIBLE</Text>
              </View>
            </View>

            <View style={styles.reasonsList}>
              <Text style={styles.reasonItem}>✓ ST category certified via e-District records</Text>
              <Text style={styles.reasonItem}>✓ Post-matric college enrollment criteria satisfied</Text>
              <Text style={styles.reasonItem}>✓ Household income (₹1.80L) is strictly within ₹2.50L cap</Text>
              <Text style={styles.reasonItem}>✓ Reusable documents verified in One Profile wallet</Text>
            </View>

            <TouchableOpacity 
              style={styles.applyBtn}
              onPress={() => router.push({ pathname: '/apply/[schemeId]', params: { schemeId: 'post_matric' } })}
            >
              <Text style={styles.applyBtnText}>Proceed with One-Click Application</Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Evaluated Scheme 2: Top Class */}
          <View style={[styles.resultCard, { borderColor: '#BFE3DE' }]}>
            <View style={styles.resultCardTop}>
              <Text style={styles.resultSchemeName}>Top Class Education for ST Students</Text>
              <View style={[styles.eligibleBadge, { backgroundColor: '#E8F4F2' }]}>
                <Text style={[styles.eligibleBadgeText, { color: colors.secondary }]}>POTENTIAL OPPORTUNITY</Text>
              </View>
            </View>
            <View style={styles.reasonsList}>
              <Text style={styles.reasonItem}>✓ Family income is within ₹6.00L ceiling</Text>
              <Text style={styles.reasonItem}>ℹ Requires checking if institution is on notified premier list</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.resetBtn}
            onPress={() => setIsEvaluated(false)}
          >
            <Text style={styles.resetBtnText}>Modify Evaluation Answers</Text>
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
    marginBottom: 8,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.charcoal,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 15,
  },
  formSection: {
    gap: 18,
  },
  questionBlock: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  questionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 12,
  },
  optionsGrid: {
    gap: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optBtn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  optBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optText: {
    fontSize: 12,
    color: colors.charcoal,
    fontWeight: '500',
  },
  optTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  checkSubmitBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  checkSubmitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultsSection: {
    gap: 14,
  },
  resultBanner: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.charcoal,
  },
  resultBannerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  resultCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  resultSchemeName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.charcoal,
    flex: 1,
  },
  eligibleBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eligibleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },
  reasonsList: {
    marginVertical: 12,
    gap: 6,
  },
  reasonItem: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resetBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
