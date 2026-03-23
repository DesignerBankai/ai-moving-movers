/**
 * AI Moving — Contact Info Screen (Onboarding Step 4)
 *
 * Collects user details:
 * - Full Name input
 * - Phone input with +1 mask: +1 (XXX) XXX-XXXX
 * - Email input with validation
 * - Info banner about AI scanning
 * - "Continue to Scanning" button
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  Input,
  StatusBarMock,
  ProgressBar,
  Navbar,
  DREAMY_BG,
} from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

// Info icon
const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M10 9V14" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="6.5" r="1" fill="#2E90FA"/>
  </svg>
);

/* ── Phone mask helper ── */
// Takes raw digits (max 10), returns full display string with +1
const formatPhoneDisplay = (digits: string): string => {
  if (digits.length === 0) return '+1';
  if (digits.length <= 3) return `+1 (${digits})`;
  if (digits.length <= 6) return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

/* ── Email validation ── */
const isValidEmail = (email: string): boolean => {
  // Basic check: has @ with something before and after, ends with .TLD
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim());
};

interface ContactInfoScreenProps {
  onContinue: (data: any) => void;
  onBack: () => void;
}

export const ContactInfoScreen: React.FC<ContactInfoScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneDigits, setPhoneDigits] = useState(''); // raw 10 digits (without +1)
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const phoneDisplay = formatPhoneDisplay(phoneDigits);
  const phoneComplete = phoneDigits.length === 10;
  const emailValid = isValidEmail(email);

  const isValid = fullName.trim().length > 0 && phoneComplete && emailValid;

  const handlePhoneChange = (text: string) => {
    // Extract only digits from whatever user typed
    let allDigits = text.replace(/\D/g, '');

    // Remove leading '1' that comes from our +1 prefix
    if (allDigits.startsWith('1')) {
      allDigits = allDigits.slice(1);
    }

    setPhoneDigits(allDigits.slice(0, 10));
  };

  const handleContinue = () => {
    if (!isValid) return;
    onContinue({ fullName, phone: `+1${phoneDigits}`, email });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />

        {/* Navbar */}
        <Navbar title="Contact info" onBack={onBack} />

        {/* Progress Bar */}
        <ProgressBar currentStep={4} />

        {/* Scrollable Content */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Full Name */}
          <View style={styles.section}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Phone */}
          <View style={styles.section}>
            <Input
              label="Phone"
              placeholder="+1 (000) 000-0000"
              value={phoneDisplay}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
            />
          </View>

          {/* Email */}
          <View style={styles.section}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              onBlur={() => setEmailTouched(true)}
              keyboardType="email-address"
            />
            {emailTouched && email.length > 0 && !emailValid && Platform.OS === 'web' && (
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 12, fontWeight: 400,
                color: colors.error[500],
                display: 'block', marginTop: 6, paddingLeft: 4,
              } as any}>
                Please enter a valid email address
              </span>
            )}
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <View style={styles.infoIconWrap}>
              <InfoIcon />
            </View>
            <View style={styles.infoTextWrap}>
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 14, fontWeight: 400, lineHeight: '20px',
                  color: colors.gray[600],
                } as any}>
                  Next, you'll use your camera to scan your belongings. Our AI will create an inventory and provide accurate moving estimates.
                </span>
              ) : (
                <Text variant="bodySm" color={colors.gray[600]}>
                  Next, you'll use your camera to scan your belongings. Our AI will create an inventory and provide accurate moving estimates.
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          <Button
            title="Continue to Scanning"
            variant="primary"
            onPress={handleContinue}
            disabled={!isValid}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },

  scrollContent: { flex: 1, paddingHorizontal: 16 },

  section: { marginTop: 12 },
  label: { marginBottom: 8 },

  infoBanner: {
    flexDirection: 'row',
    marginTop: 32,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    gap: 12,
  },
  infoIconWrap: { marginTop: 2 },
  infoTextWrap: { flex: 1 },

  bottomContainer: { paddingHorizontal: 16, paddingBottom: 32 },
});
