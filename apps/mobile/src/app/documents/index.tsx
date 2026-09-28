import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { demoStudentData } from '@/constants/demoData';
import { ArrowLeft, CheckCircle2, Clock, UploadCloud, RefreshCw, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';

export default function DocumentsScreen() {
  const docs = demoStudentData.documents;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>One Profile Document Wallet</Text>
          <Text style={styles.headerSubtitle}>Verified credentials automatically reused across schemes</Text>
        </View>
      </View>

      <View style={styles.infoBanner}>
        <ShieldCheck size={18} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoBannerTitle}>Unified Verification Rail</Text>
          <Text style={styles.infoBannerText}>
            Documents matched against state e-District, DigiLocker, and UIDAI repositories can be reused without repetitive re-uploads.
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {docs.map((doc) => {
          const isVerified = doc.status === 'VERIFIED';

          return (
            <View key={doc.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docSource}>Verification Source: {doc.source}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  isVerified ? styles.statusBadgeVerified : styles.statusBadgePending
                ]}>
                  {isVerified ? (
                    <CheckCircle2 size={12} color={colors.primary} />
                  ) : (
                    <Clock size={12} color="#B45309" />
                  )}
                  <Text style={[
                    styles.statusBadgeText,
                    isVerified ? styles.statusTextVerified : styles.statusTextPending
                  ]}>
                    {doc.status}
                  </Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                {doc.reusable && (
                  <View style={styles.reusedChip}>
                    <Text style={styles.reusedChipText}>✓ AUTO-REUSABLE</Text>
                  </View>
                )}
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>View Document</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]}>
                  <RefreshCw size={11} color={colors.textSecondary} />
                  <Text style={styles.actionBtnOutlineText}>Re-Verify</Text>
                </TouchableOpacity>
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
  },
  infoBanner: {
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBE5D4',
  },
  infoBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  infoBannerText: {
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  docName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
  },
  docSource: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeVerified: {
    backgroundColor: colors.primaryLight,
  },
  statusBadgePending: {
    backgroundColor: '#FEF3E2',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextVerified: {
    color: colors.primary,
  },
  statusTextPending: {
    color: '#B45309',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  reusedChip: {
    backgroundColor: '#E8F4F2',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  reusedChipText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.secondary,
  },
  actionBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 6,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.charcoal,
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  actionBtnOutlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
