/**
 * AI Moving — Step Progress Bar
 *
 * 4-segment progress indicator for onboarding flow.
 * Active segments: Primary 500 (#2E90FA)
 * Inactive segments: Gray 200 (#EAECF0)
 * Gap between segments, rounded ends.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../tokens/colors';

interface ProgressBarProps {
  currentStep: number; // 1-based (1, 2, 3, 4)
  totalSteps?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 4,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            {
              backgroundColor:
                index < currentStep ? colors.primary[500] : '#EFF2F7',
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});
