/**
 * AI Moving — Phone Input Screen (Screen 2)
 *
 * Figma layout:
 * - StatusBar mock (web only)
 * - Navbar: padding 0 16px 10px 16px, space-between
 * - Content: title + subtitle + masked phone input
 * - Button: "Send Code" pinned to bottom
 *
 * Phone input is a MASK: "+1 (000) 000-00-00"
 * Filled digits → black #212225, unfilled → gray #EAECF0
 * Digits replace placeholders one by one as user types
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { Text, Button, StatusBarMock, NumPadMock, Navbar, DREAMY_BG } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { spacing } from '../../design-system/tokens/spacing';
import { fontFamily } from '../../design-system/tokens/typography';

// Colors
const FILLED_COLOR = '#212225';
const EMPTY_COLOR = '#C2D0E4';

// Phone mask template: +1 (000) 000-00-00
// Digit slots are at these indices in the display string
const MASK_TEMPLATE = '+0 (000) 000-00-00';

// Format digits into masked phone string and track which chars are filled
const formatPhone = (digits: string) => {
  const template = '+_ (___) ___-__-__';
  const chars: { char: string; filled: boolean }[] = [];
  let digitIndex = 0;

  for (let i = 0; i < template.length; i++) {
    if (template[i] === '_') {
      if (digitIndex < digits.length) {
        chars.push({ char: digits[digitIndex], filled: true });
      } else {
        chars.push({ char: '0', filled: false });
      }
      digitIndex++;
    } else {
      // Static chars (+, space, (, ), -)
      const isFilled = digitIndex <= digits.length && digitIndex > 0;
      chars.push({ char: template[i], filled: digitIndex < digits.length || (digitIndex === digits.length && digits.length > 0) });
    }
  }

  return chars;
};

/**
 * Animated character for the phone mask.
 * Smooth slide-up + fade on fill, gentle fade-out on delete.
 */
const AnimatedMaskChar: React.FC<{ char: string; filled: boolean; isNext?: boolean }> = ({ char, filled, isNext }) => {
  const wasFilledRef = useRef(filled);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(filled ? 1 : 0)).current;

  useEffect(() => {
    const wasFilled = wasFilledRef.current;

    if (filled && !wasFilled) {
      // Empty → Filled: slide up from below + scale + fade in
      scaleAnim.setValue(0.7);
      translateAnim.setValue(8);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 10,
          tension: 160,
          useNativeDriver: true,
        }),
        Animated.spring(translateAnim, {
          toValue: 0,
          friction: 10,
          tension: 160,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!filled && wasFilled) {
      // Filled → Empty: scale down + fade out
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        scaleAnim.setValue(1);
        translateAnim.setValue(0);
      });
    }

    wasFilledRef.current = filled;
  }, [filled]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }, { translateY: translateAnim }] }}>
      {/* Base layer: empty placeholder */}
      <Text style={[styles.maskedChar, { color: EMPTY_COLOR }]}>
        {filled ? char : '0'}
      </Text>
      {/* Top layer: filled digit */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: opacityAnim, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.maskedChar, { color: FILLED_COLOR }]}>
          {char}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

/**
 * Animated separator chars (+, space, parens, dash).
 * Color smoothly transitions based on whether preceding digits are filled.
 */
const AnimatedSeparator: React.FC<{ char: string; filled: boolean }> = ({ char, filled }) => {
  const opacityAnim = useRef(new Animated.Value(filled ? 1 : 0)).current;
  const wasFilledRef = useRef(filled);

  useEffect(() => {
    if (filled !== wasFilledRef.current) {
      Animated.timing(opacityAnim, {
        toValue: filled ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
    wasFilledRef.current = filled;
  }, [filled]);

  return (
    <View>
      <Text style={[styles.maskedChar, { color: EMPTY_COLOR }]}>
        {char}
      </Text>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: opacityAnim, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.maskedChar, { color: FILLED_COLOR }]}>
          {char}
        </Text>
      </Animated.View>
    </View>
  );
};


interface PhoneInputScreenProps {
  onSendCode: (phoneNumber: string) => void;
  onBack?: () => void;
}

export const PhoneInputScreen: React.FC<PhoneInputScreenProps> = ({
  onSendCode,
  onBack,
}) => {
  const [digits, setDigits] = useState('');
  const hiddenInputRef = useRef<TextInput>(null);

  // Max 11 digits: 1 (country) + 10 (number)
  const MAX_DIGITS = 11;

  const handleChangeText = (text: string) => {
    // Only allow digits
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= MAX_DIGITS) {
      setDigits(cleaned);
    }
  };

  // NumPad handlers (web)
  const handleNumPadPress = (digit: string) => {
    if (digits.length < MAX_DIGITS) {
      setDigits(prev => prev + digit);
    }
  };

  const handleNumPadDelete = () => {
    setDigits(prev => prev.slice(0, -1));
  };

  const handleSendCode = () => {
    if (digits.length > 0) {
      onSendCode('+' + digits);
    }
  };

  const maskedChars = formatPhone(digits);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* Status Bar (web mock) */}
          <StatusBarMock />

          {/* Navbar */}
          <Navbar title="Sign in" onBack={onBack} />

          {/* Content */}
          <View style={styles.content}>
            {/* Header block */}
            <View style={styles.headerBlock}>
              <Text variant="h4" color="#212225" align="center">
                Enter the phone number
              </Text>
              <Text variant="bodySm" color={colors.gray[500]} align="center">
                We'll send you a confirmation code
              </Text>
            </View>

            {/* Masked Phone Display */}
            <TouchableOpacity
              style={styles.phoneDisplay}
              onPress={() => Platform.OS !== 'web' && hiddenInputRef.current?.focus()}
              activeOpacity={1}
            >
              <View style={styles.maskedRow}>
                {maskedChars.map((item, index) => {
                  const tpl = '+_ (___) ___-__-__';
                  const isSeparator = tpl[index] !== '_';

                  return isSeparator ? (
                    <AnimatedSeparator
                      key={index}
                      char={item.char}
                      filled={item.filled}
                    />
                  ) : (
                    <AnimatedMaskChar
                      key={index}
                      char={item.char}
                      filled={item.filled}
                    />
                  );
                })}
              </View>
            </TouchableOpacity>

            {/* Hidden input to capture keyboard (native only, web uses NumPadMock) */}
            {Platform.OS !== 'web' && (
              <TextInput
                ref={hiddenInputRef}
                style={styles.hiddenInput}
                value={digits}
                onChangeText={handleChangeText}
                keyboardType="number-pad"
                autoFocus
                maxLength={MAX_DIGITS}
                caretHidden
              />
            )}
          </View>

          {/* Spacer */}
          <View style={styles.flex} />

          {/* Bottom action — above keyboard */}
          <View style={styles.bottomContainer}>
            <Button
              title="Send Code"
              variant="primary"
              onPress={handleSendCode}
              disabled={digits.length === 0}
            />
          </View>

          {/* iOS NumPad mock (web only) */}
          {Platform.OS === 'web' && (
            <NumPadMock
              onPress={handleNumPadPress}
              onDelete={handleNumPadDelete}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' } as any,

  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  // Content
  content: {
    paddingTop: 32,
    alignItems: 'center',
  },

  headerBlock: {
    width: 284,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },

  // Masked phone display — Inter 36px Bold, centered
  phoneDisplay: {
    marginTop: 118,
    alignItems: 'center',
    justifyContent: 'center',
  },

  maskedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  maskedChar: {
    fontFamily: fontFamily.primaryBold,
    fontSize: 36,
    lineHeight: 50,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Hidden input — captures keyboard, invisible
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },

  // Bottom — 16px horizontal padding to match container
  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
