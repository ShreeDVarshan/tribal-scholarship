import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

interface JourneyProgressProps {
  currentStage?: 'PROFILE' | 'ELIGIBILITY' | 'APPLICATION' | 'VERIFICATION' | 'BENEFIT';
}

export const JourneyProgress: React.FC<JourneyProgressProps> = ({ currentStage = 'VERIFICATION' }) => {
  const stages = [
    { key: 'PROFILE', label: 'PROFILE' },
    { key: 'ELIGIBILITY', label: 'ELIGIBILITY' },
    { key: 'APPLICATION', label: 'APPLICATION' },
    { key: 'VERIFICATION', label: 'VERIFY' },
    { key: 'BENEFIT', label: 'BENEFIT' },
  ];

  const getStageIndex = (key: string) => stages.findIndex((s) => s.key === key);
  const currentIndex = getStageIndex(currentStage);

  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={stage.key}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.circle,
                    isCompleted && styles.circleCompleted,
                    isCurrent && styles.circleCurrent,
                  ]}
                >
                  <Text
                    style={[
                      styles.circleText,
                      (isCompleted || isCurrent) && styles.circleTextActive,
                    ]}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.label,
                    isCurrent && styles.labelCurrent,
                    isCompleted && styles.labelCompleted,
                  ]}
                >
                  {stage.label}
                </Text>
              </View>

              {idx < stages.length - 1 && (
                <View
                  style={[
                    styles.line,
                    idx < currentIndex && styles.lineCompleted,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 10,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    width: 54,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  circleCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  circleCurrent: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  circleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  circleTextActive: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  labelCompleted: {
    color: colors.primary,
  },
  labelCurrent: {
    color: colors.charcoal,
    fontWeight: '700',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginBottom: 16,
    marginHorizontal: -4,
  },
  lineCompleted: {
    backgroundColor: colors.primary,
  },
});
