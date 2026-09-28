import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { demoStudentData } from '@/constants/demoData';
import { router } from 'expo-router';
import { 
  ShieldCheck, 
  FileText, 
  Building2, 
  CreditCard, 
  Users, 
  Calendar, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Globe
} from 'lucide-react-native';

export default function ProfileScreen() {
  const p = demoStudentData;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AK</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{p.fullName}</Text>
          <Text style={styles.roleText}>{p.role} • {p.district}, {p.state}</Text>
          <View style={styles.verifiedRow}>
            <ShieldCheck size={12} color={colors.primary} />
            <Text style={styles.verifiedText}>Aadhaar Demographic Verified (XXXX 4821)</Text>
          </View>
        </View>
      </View>

      {/* One Profile Badge */}
      <View style={styles.oneProfileCard}>
        <View style={styles.oneProfileHeader}>
          <Text style={styles.oneProfileTitle}>ONE PLATFORM • ONE PROFILE</Text>
          <Text style={styles.oneProfileScore}>{p.profileCompletion}%</Text>
        </View>
        <Text style={styles.oneProfileDesc}>
          Your verified credentials and certified documents are securely bound to your sovereign student record, eliminating redundant uploads forever.
        </Text>
      </View>

      {/* Unique Feature Links */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>PLATFORM CAPABILITIES</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/documents')}>
          <FileText size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.menuItemText}>My Document Wallet</Text>
            <Text style={styles.menuItemSub}>5 Verified Reusable Documents</Text>
          </View>
          <ChevronRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/family')}>
          <Users size={18} color={colors.secondary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.menuItemText}>Family Scholarship Overview</Text>
            <Text style={styles.menuItemSub}>Sibling & Household Entitlements</Text>
          </View>
          <ChevronRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/calendar')}>
          <Calendar size={18} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.menuItemText}>Personalized Scholarship Calendar</Text>
            <Text style={styles.menuItemSub}>Document Renewals & Deadlines</Text>
          </View>
          <ChevronRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/readiness')}>
          <ShieldCheck size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.menuItemText}>Application Readiness Score</Text>
            <Text style={styles.menuItemSub}>Diagnostic: 88% Prepared</Text>
          </View>
          <ChevronRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* General Settings */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>PREFERENCES & SUPPORT</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings/language')}>
          <Globe size={18} color={colors.charcoal} />
          <View style={{ flex: 1 }}>
            <Text style={styles.menuItemText}>Multilingual Preferences</Text>
            <Text style={styles.menuItemSub}>English (English, हिन्दी, தமிழ்)</Text>
          </View>
          <ChevronRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/help')}>
          <HelpCircle size={18} color={colors.charcoal} />
          <View style={{ flex: 1 }}>
            <Text style={styles.menuItemText}>Helpline & Official Information</Text>
            <Text style={styles.menuItemSub}>Ministry of Tribal Affairs Contacts</Text>
          </View>
          <ChevronRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, { marginTop: 10 }]} 
          onPress={() => router.replace('/login')}
        >
          <LogOut size={18} color="#DC2626" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Sign Out</Text>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.charcoal,
  },
  roleText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
  oneProfileCard: {
    backgroundColor: '#FAF9F7',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  oneProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  oneProfileTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  oneProfileScore: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  oneProfileDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  menuSection: {
    marginBottom: 16,
  },
  menuSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 8,
    paddingLeft: 4,
  },
  menuItem: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
  },
  menuItemSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
