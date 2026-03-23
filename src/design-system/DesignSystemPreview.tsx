/**
 * AI Moving — Design System Preview
 *
 * This screen shows all tokens and components for visual verification.
 * Use this during development to check that everything matches Figma.
 */

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from './components/Text';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { colors } from './tokens/colors';
import { spacing } from './tokens/spacing';

const ColorSwatch = ({ name, color }: { name: string; color: string }) => (
  <View style={previewStyles.swatch}>
    <View style={[previewStyles.swatchColor, { backgroundColor: color }]} />
    <Text variant="bullit" color={colors.gray[600]}>
      {name}
    </Text>
  </View>
);

export const DesignSystemPreview: React.FC = () => {
  return (
    <ScrollView
      style={previewStyles.container}
      contentContainerStyle={previewStyles.content}
    >
      {/* ===== TYPOGRAPHY ===== */}
      <Text variant="h3" style={previewStyles.sectionTitle}>
        Typography
      </Text>

      <Text variant="display">Display</Text>
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="bodyLgBold">Body Large Bold</Text>
      <Text variant="bodyLg">Body Large Regular</Text>
      <Text variant="bodyMdSemibold">Body Medium Semibold</Text>
      <Text variant="bodyMd">Body Medium Regular</Text>
      <Text variant="bodySm">Body Small Regular</Text>
      <Text variant="bullitLg">BULLIT LARGE — CHIVO MONO</Text>
      <Text variant="bullit">BULLIT — CHIVO MONO</Text>

      <View style={previewStyles.divider} />

      {/* ===== COLORS ===== */}
      <Text variant="h3" style={previewStyles.sectionTitle}>
        Colors
      </Text>

      <Text variant="bodyMdSemibold" style={previewStyles.subsection}>
        Primary
      </Text>
      <View style={previewStyles.swatchRow}>
        <ColorSwatch name="100" color={colors.primary[100]} />
        <ColorSwatch name="300" color={colors.primary[300]} />
        <ColorSwatch name="500" color={colors.primary[500]} />
        <ColorSwatch name="700" color={colors.primary[700]} />
        <ColorSwatch name="900" color={colors.primary[900]} />
      </View>

      <Text variant="bodyMdSemibold" style={previewStyles.subsection}>
        Gray
      </Text>
      <View style={previewStyles.swatchRow}>
        <ColorSwatch name="100" color={colors.gray[100]} />
        <ColorSwatch name="300" color={colors.gray[300]} />
        <ColorSwatch name="500" color={colors.gray[500]} />
        <ColorSwatch name="700" color={colors.gray[700]} />
        <ColorSwatch name="900" color={colors.gray[900]} />
      </View>

      <Text variant="bodyMdSemibold" style={previewStyles.subsection}>
        Status
      </Text>
      <View style={previewStyles.swatchRow}>
        <ColorSwatch name="Error" color={colors.error[500]} />
        <ColorSwatch name="Warning" color={colors.warning[500]} />
        <ColorSwatch name="Success" color={colors.success[500]} />
      </View>

      <View style={previewStyles.divider} />

      {/* ===== BUTTONS ===== */}
      <Text variant="h3" style={previewStyles.sectionTitle}>
        Buttons
      </Text>

      <View style={previewStyles.buttonGroup}>
        <Button title="Primary Button" variant="primary" />
        <Button title="Secondary Button" variant="secondary" />
        <Button title="Ghost Button" variant="ghost" />
        <Button title="Disabled" disabled />
        <Button title="Loading..." loading />
        <Button title="Small Button" size="sm" />
      </View>

      <View style={previewStyles.divider} />

      {/* ===== INPUTS ===== */}
      <Text variant="h3" style={previewStyles.sectionTitle}>
        Inputs
      </Text>

      <View style={previewStyles.inputGroup}>
        <Input label="Phone number" placeholder="+1 (555) 000-0000" />
        <Input label="Email" placeholder="you@example.com" hint="We'll never share your email" />
        <Input label="Full name" placeholder="John Doe" error="This field is required" />
        <Input label="Disabled" placeholder="Can't edit this" disabled />
      </View>

      <View style={{ height: spacing[16] }} />
    </ScrollView>
  );
};

const previewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing[6],
    paddingTop: spacing[16],
  },
  sectionTitle: {
    marginBottom: spacing[6],
  },
  subsection: {
    marginBottom: spacing[2],
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing[8],
  },
  swatchRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  swatch: {
    alignItems: 'center',
    gap: spacing[1],
  },
  swatchColor: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  buttonGroup: {
    gap: spacing[3],
  },
  inputGroup: {
    gap: spacing[5],
  },
});
