/**
 * AI Moving — Text Component
 *
 * Typography component that maps design tokens to React Native Text.
 * Usage:
 *   <Text variant="h1">Hello</Text>
 *   <Text variant="bodyMd" color={colors.gray[600]}>Subtitle</Text>
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { typography } from '../tokens/typography';
import { colors } from '../tokens/colors';

type TypographyVariant = keyof typeof typography;

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'bodyMd',
  color = colors.gray[900],
  align = 'left',
  style,
  children,
  ...rest
}) => {
  const variantStyle = typography[variant];

  return (
    <RNText
      style={[
        variantStyle,
        { color, textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};
