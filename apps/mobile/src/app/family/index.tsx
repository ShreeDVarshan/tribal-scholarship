import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { demoStudentData } from '@/constants/demoData';
import { ArrowLeft, Users, CheckCircle2, AlertCircle, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

export default function FamilyScreen() {
  const family = demoStudentData.family;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Family Scholarship View</Text>
          <Text style={styles.headerSubtitle}>Multi-beneficiary household transparency</Text>
        </View>
      </View>

      <View style={styles.banner}>
        <Users size={20} color={colors.secondary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Unified Household Entitlement</Text>
          <Text style={styles.bannerDesc}>
            Ensures tribal families with multiple children in school, college, or higher studies never miss scheme benefits due to isolated portals.
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {/* Arjun (Primary) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.memberName}>Arjun Kumar (You)</Text>
              <Text style={styles.memberSub}>College Student • 3rd Year UG</Text>
            </View>
            <View style={styles.badgeActive}>
              <Text style={styles.badgeActiveText}>ACTIVE</Text>
            </View>
          </View>
          <Text style={styles.schemeName}>Post-Matric Scholarship for ST Students</Text>
          <Text style={styles.statusDetail}>Under Department Verification (Expected Sanction: ₹42,000)</Text>
        </View>

        {/* Priya (Sister) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.memberName}>Priya Kumar (Sister)</Text>
              <Text style={styles.memberSub}>School Student • Class 10</Text>
            </View>
            <View style={[styles.badgeActive, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.badgeActiveText, { color: colors.primary }]}>DISBURSED</Text>
            </View>
          </View>
          <Text style={styles.schemeName}>Pre-Matric Scholarship for ST Students</Text>
          <Text style={styles.statusDetail}>₹3,500 DBT credited to guardian bank account for 2024-25 cycle.</Text>
        </View>

        {/* Ravi (Brother) */}
        <View style={[styles.card, { borderColor: '#FDE68A', backgroundColor: '#FFFDF9' }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.memberName}>Ravi Kumar (Brother)</Text>
              <Text style={styles.memberSub}>School Student • Class 9</Text>
            </View>
            <View style={[styles.badgeActive, { backgroundColor: '#FEF3E2' }]}>
              <Text style={[styles.badgeActiveText, { color: colors.warning }]}>UNCLAIMED</Text>
            </View>
          </View>
          <Text style={styles.schemeName}>Potential Gap: Pre-Matric ST Entitlement</Text>
          <Text style={[styles.statusDetail, { color: colors.warning }]}>
            No application registered. Likely eligible under family income cap.
          </Text>
          <TouchableOpacity 
            style={styles.claimBtn}
            onPress={() => router.push('/eligibility')}
          >
            <Text style={styles.claimBtnText}>Initiate Sibling Application</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.addBtn}>
        <Plus size={16} color={colors.primary} />
        <Text style={styles.addBtnText}>Link Another Family Member</Text>
      </TouchableOpacity>
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
  banner: {
    backgroundColor: '#E8F4F2',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFE3DE',
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.secondary,
  },
  bannerDesc: {
    fontSize: 11,
    color: colors.charcoal,
    marginTop: 2,
    lineHeight: 15,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.charcoal,
  },
  memberSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badgeActive: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeActiveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  schemeName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  statusDetail: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 15,
  },
  claimBtn: {
    backgroundColor: colors.warning,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  claimBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    marginTop: 16,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
