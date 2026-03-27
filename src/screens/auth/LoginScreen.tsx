/**
 * AI Moving — Mover App — Login Screen
 *
 * Animated floating blobs background + login form.
 * Background palette derived from Input bg (#EFF2F7).
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  Input,
  StatusBarMock,
  Navbar,
} from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

/* ───────── Animated background (web only) ───────── */

const WebAnimatedBackground = () => {
  if (Platform.OS !== 'web') return null;

  const keyframes = `
    @keyframes float1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(20px, 30px) scale(1.06); }
      66% { transform: translate(-10px, 15px) scale(0.97); }
    }
    @keyframes float2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(-20px, 25px) scale(1.08); }
      66% { transform: translate(12px, -8px) scale(0.95); }
    }
    @keyframes float3 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(25px, -20px) scale(1.04); }
      66% { transform: translate(-15px, 12px) scale(1.06); }
    }
    @keyframes float4 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(18px, -15px) scale(1.05); }
      66% { transform: translate(-8px, 22px) scale(0.96); }
    }
    @keyframes float5 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(-22px, 18px) scale(1.03); }
      66% { transform: translate(14px, -12px) scale(1.07); }
    }
  `;

  // Palette based on #EFF2F7 (input bg) — same cool gray-blue family
  const blobs = [
    { size: 280, color: 'rgba(218,225,236,0.50)', left: -60,    top: -40,    anim: 'float1', dur: '9s'  },
    { size: 220, color: 'rgba(203,213,228,0.35)', left: '58%',  top: 60,     anim: 'float2', dur: '11s' },
    { size: 320, color: 'rgba(228,231,236,0.40)', left: 40,     top: '48%',  anim: 'float3', dur: '13s' },
    { size: 200, color: 'rgba(210,218,230,0.45)', left: -30,    top: '70%',  anim: 'float4', dur: '10s' },
    { size: 240, color: 'rgba(220,226,235,0.35)', left: '52%',  top: '35%',  anim: 'float5', dur: '12s' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' } as any}>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            backgroundColor: b.color,
            filter: 'blur(50px)',
            animation: `${b.anim} ${b.dur} ease-in-out infinite`,
            willChange: 'transform',
          } as any}
        />
      ))}
    </div>
  );
};

/* ───────── Login Screen ───────── */

interface LoginScreenProps {
  onLogin: (login: string, password: string) => void;
  onForgotPassword: () => void;
}

/* ───────── Eye icons for password toggle ───────── */

const EyeIcon = ({ size = 20, color = '#8E8E93' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill={color} />
  </svg>
);

const EyeOffIcon = ({ size = 20, color = '#8E8E93' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 6.5c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.61 17 4.5 12 4.5c-1.27 0-2.49.2-3.64.57l1.65 1.65c.65-.14 1.31-.22 1.99-.22zM2 3.27l2.28 2.28.46.46A11.8 11.8 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 3.27zM7.53 8.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill={color} />
  </svg>
);

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email validation
  const validateEmail = (value: string): boolean => {
    if (!value.trim()) return true; // empty is not an error (just disabled button)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailTouched) {
      if (!text.trim()) {
        setEmailError('');
      } else if (!validateEmail(text)) {
        setEmailError('Enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (email.trim() && !validateEmail(email)) {
      setEmailError('Enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const isValid = email.trim().length > 0 && password.trim().length > 0 && !emailError && validateEmail(email);

  const handleLogin = () => {
    if (!isValid) return;
    onLogin(email, password);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Clean background — no animated blobs */}

        <StatusBarMock />
        <Navbar />

        {/* Content */}
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerBlock}>
            <Text variant="h3" color="#212225" align="center">
              Welcome back
            </Text>
            <Text variant="bodyMd" color={colors.gray[500]} align="center">
              Sign in to manage your moves and stay on schedule
            </Text>
          </View>

          {/* Inputs */}
          <View style={styles.inputsBlock}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={handleEmailBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError || undefined}
              required
            />

            <View style={styles.spacer} />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              required
              rightElement={
                Platform.OS === 'web' ? (
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 } as any}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </div>
                ) : (
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </TouchableOpacity>
                )
              }
            />

            <TouchableOpacity onPress={onForgotPassword} style={styles.forgotContainer}>
              <Text variant="bodySm" color={colors.primary[500]}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          <Button
            title="Sign in"
            variant="primary"
            onPress={handleLogin}
            disabled={!isValid}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFD' },
  container: { flex: 1, backgroundColor: '#FAFBFD' },

  scrollContent: { flex: 1, zIndex: 1 },
  scrollInner: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
  },

  headerBlock: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },

  inputsBlock: {
    width: '100%',
  },

  spacer: { height: 12 },

  forgotContainer: { marginTop: 16, alignSelf: 'flex-end' },

  bottomContainer: { paddingHorizontal: 16, paddingBottom: 32, zIndex: 1 },
});
