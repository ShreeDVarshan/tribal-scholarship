import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '@/constants/colors';
import { Logo } from '@/components/ui/Logo';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { ShieldCheck, ArrowRight, Phone, KeyRound } from 'lucide-react-native';

export default function LoginScreen() {
  const [mobile, setMobile] = useState('9999999999');
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const loginWithOTP = useAuthStore((s) => s.loginWithOTP);

  const handleLogin = async () => {
    if (!mobile || !otp) {
      Alert.alert('Required', 'Please enter mobile number and OTP');
      return;
    }
    setLoading(true);
    const ok = await loginWithOTP(mobile, otp);
    setLoading(false);
    if (ok) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Authentication Failed', 'Please verify your demo credentials.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.logoRow}>
        <Logo size="lg" />
      </View>

      <View style={styles.taglineBox}>
        <Text style={styles.tagline}>"One Platform. One Profile. One Right."</Text>
        <Text style={styles.taglineSub}>Direct access to 5 Ministry of Tribal Affairs Scholarship Schemes</Text>
      </View>

      {/* Demo Credentials Box */}
      <View style={styles.demoCard}>
        <View style={styles.demoHeader}>
          <ShieldCheck size={16} color={colors.primary} />
          <Text style={styles.demoHeaderText}>PRE-LOADED PROTOTYPE CREDENTIALS</Text>
        </View>
        <Text style={styles.demoDetail}>
          Student: <Text style={styles.demoMono}>9999999999 (Arjun Kumar)</Text>
        </Text>
        <Text style={styles.demoDetail}>
          Demo OTP: <Text style={styles.demoMono}>123456</Text> (Simulated authentication)
        </Text>
      </View>

      {/* Inputs */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Student Sign In</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View style={styles.inputWrapper}>
            <Phone size={16} color={colors.textSecondary} />
            <TextInput
              style={styles.textInput}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="10-digit mobile"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Enter OTP</Text>
          <View style={styles.inputWrapper}>
            <KeyRound size={16} color={colors.textSecondary} />
            <TextInput
              style={styles.textInput}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="6-digit OTP"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <Text style={styles.otpHint}>Demo Mode active: Use code 123456</Text>
        </View>

        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>{loading ? 'Verifying...' : 'Sign In with OTP'}</Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          Ministry of Tribal Affairs, Government of India • National Informatics Integration Rail (Prototype)
        </Text>
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
    padding: 20,
    paddingTop: 64,
    paddingBottom: 40,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  taglineBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  taglineSub: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  demoCard: {
    backgroundColor: '#FAF9F7',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  demoHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  demoDetail: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  demoMono: {
    fontWeight: '700',
    color: colors.charcoal,
    fontFamily: 'monospace',
  },
  formCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.charcoal,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceMuted,
    height: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: colors.charcoal,
    fontWeight: '600',
  },
  otpHint: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
    paddingLeft: 2,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footerNote: {
    marginTop: 28,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 14,
    maxWidth: 280,
  },
});
