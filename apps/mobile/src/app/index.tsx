import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Logo } from '@/components/ui/Logo';

export default function Index() {
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Logo size="lg" />
      <Text style={styles.tagline}>"One Platform. One Profile. One Right."</Text>
      <Text style={styles.footer}>Unified ST Scholarship Management Infrastructure</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 20,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
