/**
 * AI Moving — Input Component
 *
 * Figma specs:
 * ┌──────────┬─────────────────────────────────────────────────────────┐
 * │ Default  │ bg #FFFFFF, shadow 5px 5px 30px rgba(116,142,170,0.12)│
 * │          │ placeholder #A0A7AF Inter 16px Regular                 │
 * │          │ minHeight 62, border-radius 12, padding 12px 16px     │
 * │ Typing   │ bg #F9F9F9, floating label (#A0A7AF 12px Medium),    │
 * │          │ text #212225 Inter 16px Regular, cursor #53B1FD        │
 * │ Filled   │ same as typing but no cursor                          │
 * │ Error    │ border 1px error.500                                   │
 * │ Disabled │ bg gray.50, text gray.400                              │
 * └──────────┴─────────────────────────────────────────────────────────┘
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Platform,
} from 'react-native';
import { Text } from './Text';
import { colors } from '../tokens/colors';
import { fontFamily } from '../tokens/typography';

// Colors from Figma
const PLACEHOLDER_COLOR = 'rgba(0, 0, 0, 0.5)';
const TEXT_COLOR = '#000000';
const CURSOR_COLOR = colors.primary[400]; // #53B1FD

interface InputProps extends Omit<TextInputProps, 'onChangeText' | 'onFocus' | 'onBlur'> {
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  onChangeText?: (text: string) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  disabled = false,
  containerStyle,
  style,
  value,
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  // Track if input has content (for floating label)
  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = currentValue.length > 0;
  const isActive = isFocused || hasValue;

  // Border logic: error > focus > none
  const borderStyle: ViewStyle = error
    ? { borderWidth: 1, borderColor: colors.error[500] }
    : isFocused
    ? { borderWidth: 1, borderColor: colors.primary[500] }
    : { borderWidth: 0 };

  const showFloatingLabel = label && isActive;
  const displayPlaceholder = isActive && label ? undefined : (placeholder || label);

  // Background
  const bgColor = disabled ? colors.gray[50] : '#EFF2F7';

  // ─── WEB RENDER (with animated floating label) ───
  if (Platform.OS === 'web') {
    const webDisplayPlaceholder = label ? '' : (placeholder || '');

    return (
      <div style={{ width: '100%', ...((containerStyle as any) || {}) } as any}>
        <div
          style={{
            position: 'relative',
            borderRadius: 12,
            paddingLeft: 16,
            paddingRight: 16,
            height: 62,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: bgColor,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: error ? colors.error[500] : isFocused ? colors.primary[500] : 'transparent',
            transition: 'border-color 200ms ease',
            boxSizing: 'border-box',
            overflow: 'hidden',
          } as any}
        >
          {/* Animated floating label */}
          {label && (
            <span
              style={{
                position: 'absolute',
                left: 16,
                top: isActive ? 12 : 21,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: isActive ? 12 : 16,
                fontWeight: isActive ? 500 : 400,
                lineHeight: isActive ? '14px' : '19px',
                color: PLACEHOLDER_COLOR,
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              } as any}
            >
              {label}
            </span>
          )}

          {/* Input — nudged down when label floats */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingTop: label && isActive ? 14 : 0,
              transition: 'padding-top 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            } as any}
          >
            <input
              type={rest.secureTextEntry ? 'password' : rest.keyboardType === 'email-address' ? 'email' : 'text'}
              inputMode={rest.keyboardType === 'number-pad' ? 'numeric' : undefined}
              placeholder={webDisplayPlaceholder}
              disabled={disabled}
              value={value || ''}
              onChange={(e: any) => {
                let raw = e.target.value;
                if (rest.keyboardType === 'number-pad') {
                  raw = raw.replace(/[^0-9]/g, '');
                }
                const limited = rest.maxLength ? raw.slice(0, rest.maxLength) : raw;
                setInternalValue(limited);
                onChangeText?.(limited);
              }}
              onFocus={(e: any) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e: any) => {
                setIsFocused(false);
                onBlur?.(e);
              }}
              style={{
                width: '100%',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16,
                lineHeight: '19px',
                fontWeight: 400,
                padding: 0,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: disabled ? colors.gray[400] : TEXT_COLOR,
                height: 19,
              } as any}
            />
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 4 } as any}>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 13,
              color: colors.error[500],
            } as any}>{error}</span>
          </div>
        )}

        {hint && !error && (
          <div style={{ marginTop: 4 } as any}>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 13,
              color: colors.gray[500],
            } as any}>{hint}</span>
          </div>
        )}
      </div>
    );
  }

  // ─── NATIVE RENDER ───
  const nativeBorderStyle: ViewStyle = error
    ? { borderWidth: 1, borderColor: colors.error[500] }
    : isFocused
    ? { borderWidth: 1, borderColor: colors.primary[500] }
    : { borderWidth: 0 };

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.inputContainer,
          nativeBorderStyle,
          { backgroundColor: bgColor },
        ]}
      >
        {showFloatingLabel && (
          <Text style={styles.floatingLabel}>
            {label}
          </Text>
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: disabled ? colors.gray[400] : TEXT_COLOR,
            },
            style,
          ]}
          placeholder={displayPlaceholder}
          placeholderTextColor={PLACEHOLDER_COLOR}
          selectionColor={CURSOR_COLOR}
          editable={!disabled}
          value={value}
          onChangeText={(text) => {
            const filtered = rest.keyboardType === 'number-pad'
              ? text.replace(/[^0-9]/g, '')
              : text;
            setInternalValue(filtered);
            onChangeText?.(filtered);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>

      {error && (
        <Text
          variant="bodySm"
          color={colors.error[500]}
          style={styles.message}
        >
          {error}
        </Text>
      )}

      {hint && !error && (
        <Text
          variant="bodySm"
          color={colors.gray[500]}
          style={styles.message}
        >
          {hint}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  // Figma: padding 12px 16px, gap 4px, border-radius 12, minHeight 62
  inputContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 62,
  },

  // Floating label: #A0A7AF, Inter 12px, Medium (500), line-height 120%
  floatingLabel: {
    fontFamily: fontFamily.primaryMedium,
    fontSize: 12,
    lineHeight: 14,
    color: PLACEHOLDER_COLOR,
    fontWeight: '500',
  },

  // Input text: Inter 16px Regular, line-height 120%, color #212225
  input: {
    width: '100%',
    fontFamily: fontFamily.primary,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '400',
    padding: 0,
  },

  message: {
    marginTop: 4,
  },
});
