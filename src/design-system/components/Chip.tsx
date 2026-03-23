/**
 * AI Moving — Chip / Tag Selector
 *
 * Figma specs:
 * Selected:   bg #2E90FA, text #FFF
 * Unselected: bg #EFF2F7, text rgba(0,0,0,0.5)
 * Container:  padding 16px, gap 10px, border-radius 12
 * Text:       Inter 16px Regular (400), line-height 120%
 */

import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { Text } from './Text';
import { colors } from '../tokens/colors';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  inactiveBg?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  inactiveBg,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected ? styles.chipSelected : [styles.chipDefault, inactiveBg ? { backgroundColor: inactiveBg } : null],
      ]}
    >
      {Platform.OS === 'web' ? (
        <span
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '19.2px',
            color: selected ? '#FFFFFF' : 'rgba(0, 0, 0, 0.5)',
            userSelect: 'none',
          } as any}
        >
          {label}
        </span>
      ) : (
        <Text variant="bodySm" color={selected ? '#FFFFFF' : 'rgba(0, 0, 0, 0.5)'}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  chipDefault: {
    backgroundColor: '#EFF2F7',
  },

  chipSelected: {
    backgroundColor: colors.primary[500],
  },
});
