/**
 * AI Moving — Button Component
 *
 * Primary, secondary, and ghost buttons with pressed & disabled states.
 * Font: Chivo Mono (Bullit style)
 *
 * States per variant:
 * ┌─────────────┬──────────────────────────┬──────────────────────────┬───────────────────────┐
 * │             │ Default                  │ Pressed                  │ Disabled              │
 * ├─────────────┼──────────────────────────┼──────────────────────────┼───────────────────────┤
 * │ Primary     │ bg #2E90FA, text white   │ bg #FFF, text #2E90FA   │ bg gray.100, text 400 │
 * │ Secondary   │ bg rgba(20,20,20,0.03)   │ bg #2E90FA, text white  │ bg same, text gray300 │
 * │ Ghost       │ transparent              │ transparent (opacity)    │ transparent, text 300 │
 * └─────────────┴──────────────────────────┴──────────────────────────┴───────────────────────┘
 *
 * Usage:
 *   <Button title="Get Started" onPress={handlePress} />
 *   <Button title="Cancel" variant="secondary" onPress={handleCancel} />
 *   <Button title="Skip" variant="ghost" onPress={handleSkip} />
 *   <Button title="Unavailable" disabled />
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Text } from './Text';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { fontFamily } from '../tokens/typography';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'lg' | 'md' | 'sm';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

// Color map per variant and state
const variantColors = {
  primary: {
    default: { bg: colors.primary[500], text: colors.white },
    pressed: { bg: colors.white, text: colors.primary[500] },
    disabled: { bg: colors.gray[100], text: colors.gray[400] },
  },
  secondary: {
    default: { bg: '#EFF2F7', text: colors.gray[700] },
    pressed: { bg: colors.primary[500], text: colors.white },
    disabled: { bg: '#EFF2F7', text: colors.gray[300] },
  },
  ghost: {
    default: { bg: 'transparent', text: colors.gray[700] },
    pressed: { bg: 'transparent', text: colors.gray[700] },
    disabled: { bg: 'transparent', text: colors.gray[300] },
  },
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}) => {
  const getState = (pressed: boolean) => {
    if (disabled) return 'disabled';
    if (pressed) return 'pressed';
    return 'default';
  };

  const fontSize = size === 'lg' ? 17 : size === 'md' ? 15 : 13;
  const lineH = size === 'lg' ? '22px' : size === 'md' ? '20px' : '18px';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => {
        const state = getState(pressed);
        const colorSet = variantColors[variant][state];

        return [
          styles.base,
          styles[`size_${size}`],
          {
            backgroundColor: colorSet.bg,
            opacity: variant === 'ghost' && pressed ? 0.6 : 1,
          },
          fullWidth && styles.fullWidth,
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const state = getState(pressed);
        const colorSet = variantColors[variant][state];

        return loading ? (
          <ActivityIndicator color={colorSet.text} />
        ) : Platform.OS === 'web' ? (
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize,
              fontWeight: 700,
              lineHeight: lineH,
              letterSpacing: -0.2,
              color: colorSet.text,
              textAlign: 'center',
            } as any}
          >
            {title}
          </span>
        ) : (
          <Text
            variant="bodySm"
            color={colorSet.text}
            align="center"
            style={[styles.buttonText, { fontSize, lineHeight: parseInt(lineH) }]}
          >
            {title}
          </Text>
        );
      }}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sizes
  size_lg: {
    paddingVertical: 18,
    paddingHorizontal: spacing[6], // 24px
    gap: spacing[1],               // 4px
  },
  size_md: {
    paddingVertical: spacing[3],   // 12px
    paddingHorizontal: spacing[5], // 20px
    borderRadius: 14,
    gap: spacing[1],               // 4px
  },
  size_sm: {
    paddingVertical: spacing[2],   // 8px
    paddingHorizontal: spacing[4], // 16px
    gap: spacing[1],               // 4px
  },

  fullWidth: {
    width: '100%',
  },

  buttonText: {
    fontFamily: fontFamily.primaryMedium,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
});
