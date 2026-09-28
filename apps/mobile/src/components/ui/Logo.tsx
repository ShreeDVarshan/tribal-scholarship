import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.badge, size === 'lg' && styles.badgeLg]}>
        <Text style={[styles.letter, size === 'lg' && styles.letterLg]}>J</Text>
      </View>
      <View>
        <Text style={[styles.title, size === 'lg' && styles.titleLg]}>JANJATHI SETU</Text>
        <Text style={styles.subtitle}>Ministry of Tribal Affairs</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLg: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  letter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  letterLg: {
    fontSize: 26,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.charcoal,
    letterSpacing: 0.5,
  },
  titleLg: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
