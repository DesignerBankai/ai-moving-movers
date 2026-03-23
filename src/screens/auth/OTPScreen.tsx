/**
 * AI Moving — OTP Verification Screen (Screen 3)
 *
 * Figma layout (mirrors PhoneInputScreen structure):
 * - StatusBar mock (web only)
 * - Navbar: back arrow + "Sign in" centered
 * - Header: "Confirm the number" + description with phone number
 * - Masked 4-digit input (same pattern as phone mask)
 * - "Resend code in 00:XX" link
 * - "Continue" button above NumPad
 * - iOS NumPad mock (web only)
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
import { fontFamily } from '../../design-system/tokens/typography';

const CODE_LENGTH = 4;

// Colors
const FILLED_COLOR = '#212225';
const EMPTY_COLOR = '#C2D0E4';

/**
 * Animated OTP digit — same pattern as PhoneInputScreen mask chars.
 */
const AnimatedOTPChar: React.FC<{ char: string; filled: boolean }> = ({ char, filled }) => {
  const wasFilledRef = useRef(filled);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(filled ? 1 : 0)).current;

  useEffect(() => {
    const wasFilled = wasFilledRef.current;

    if (filled && !wasFilled) {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!filled && wasFilled) {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start();
    }

    wasFilledRef.current = filled;
  }, [filled]);

  return (
    <Animated.View style={[styles.otpCharContainer, { transform: [{ scale: scaleAnim }] }]}>
      {/* Base layer: gray placeholder — only visible when NOT filled */}
      {!filled && (
        <Text style={[styles.otpChar, { color: EMPTY_COLOR }]}>0</Text>
      )}
      {/* Filled layer: black digit with white background to fully cover placeholder */}
      {filled && (
        <Animated.View style={[styles.otpCharOverlay, { opacity: opacityAnim }]}>
          <Text style={[styles.otpChar, { color: FILLED_COLOR }]}>{char}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

/**
 * Format phone number for display: "+1 (234) 567-89-01"
 */
const formatPhoneDisplay = (phone: string): string => {
  // phone comes as "+1234567890" — strip the +
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length < 1) return phone;

  const template = '+_ (___) ___-__-__';
  let result = '';
  let di = 0;

  for (let i = 0; i < template.length && di < digits.length; i++) {
    if (template[i] === '_') {
      result += digits[di];
      di++;
    } else {
      result += template[i];
    }
  }

  return result;
};

interface OTPScreenProps {
  phoneNumber: string;
  onConfirm: (code: string) => void;
  onResendCode: () => void;
  onBack?: () => void;
}

export const OTPScreen: React.FC<OTPScreenProps> = ({
  phoneNumber,
  onConfirm,
  onResendCode,
  onBack,
}) => {
  const [digits, setDigits] = useState('');
  const hiddenInputRef = useRef<TextInput>(null);

  // Resend timer (60 seconds)
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    if (canResend) {
      onResendCode();
      setTimer(59);
      setCanResend(false);
    }
  };

  // NumPad handlers (web)
  const handleNumPadPress = (digit: string) => {
    if (digits.length < CODE_LENGTH) {
      const newDigits = digits + digit;
      setDigits(newDigits);
    }
  };

  const handleNumPadDelete = () => {
    setDigits(prev => prev.slice(0, -1));
  };

  // Native TextInput handler
  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= CODE_LENGTH) {
      setDigits(cleaned);
    }
  };

  const handleContinue = () => {
    if (digits.length === CODE_LENGTH) {
      onConfirm(digits);
    }
  };

  const formattedPhone = formatPhoneDisplay(phoneNumber);
  const timerFormatted = `00:${timer.toString().padStart(2, '0')}`;

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
                Confirm the number
              </Text>
              <Text variant="bodySm" color={colors.gray[500]} align="center">
                We have sent an SMS code to {formattedPhone}. Please enter it here.
              </Text>
            </View>

            {/* Masked OTP Display */}
            <TouchableOpacity
              style={styles.otpDisplay}
              onPress={() => Platform.OS !== 'web' && hiddenInputRef.current?.focus()}
              activeOpacity={1}
            >
              <View style={styles.otpRow}>
                {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                  <AnimatedOTPChar
                    key={index}
                    char={digits[index] || '0'}
                    filled={index < digits.length}
                  />
                ))}
              </View>
            </TouchableOpacity>

            {/* Resend timer */}
            <TouchableOpacity
              style={styles.resendContainer}
              onPress={handleResend}
              disabled={!canResend}
              activeOpacity={canResend ? 0.7 : 1}
            >
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: '22px',
                  color: canResend ? colors.primary[500] : colors.gray[400],
                  textAlign: 'center',
                } as any}>
                  {canResend ? 'Resend code' : `Resend code in ${timerFormatted}`}
                </span>
              ) : (
                <Text
                  variant="bodySm"
                  color={canResend ? colors.primary[500] : colors.gray[400]}
                  align="center"
                >
                  {canResend ? 'Resend code' : `Resend code in ${timerFormatted}`}
                </Text>
              )}
            </TouchableOpacity>

            {/* Hidden input (native only) */}
            {Platform.OS !== 'web' && (
              <TextInput
                ref={hiddenInputRef}
                style={styles.hiddenInput}
                value={digits}
                onChangeText={handleChangeText}
                keyboardType="number-pad"
                autoFocus
                maxLength={CODE_LENGTH}
                caretHidden
              />
            )}
          </View>

          {/* Spacer */}
          <View style={styles.flex} />

          {/* Bottom action — above keyboard */}
          <View style={styles.bottomContainer}>
            <Button
              title="Continue"
              variant="primary"
              onPress={handleContinue}
              disabled={digits.length < CODE_LENGTH}
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

  // OTP display — same spacing as phone mask
  otpDisplay: {
    marginTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },

  otpCharContainer: {
    width: 28,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  otpChar: {
    fontFamily: fontFamily.primaryBold,
    fontSize: 36,
    lineHeight: 50,
    fontWeight: '700',
    textAlign: 'center',
    width: 28,
  },

  otpCharOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Resend timer
  resendContainer: {
    marginTop: 24,
    paddingVertical: 8,
  },

  // Hidden input
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },

  // Bottom
  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
