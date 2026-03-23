/**
 * AI Moving — Mover App — Login Screen
 *
 * Animated floating blobs background + login form.
 * Background palette derived from Input bg (#EFF2F7).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  Dimensions,
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

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onForgotPassword,
}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginTouched, setLoginTouched] = useState(false);

  // Email validation
  const validateEmail = (email: string): boolean => {
    if (!email.trim()) return true; // empty is not an error (just disabled button)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
    return emailRegex.test(email.trim()) || phoneRegex.test(email.trim());
  };

  const handleLoginChange = (text: string) => {
    setLogin(text);
    if (loginTouched) {
      if (!text.trim()) {
        setLoginError('');
      } else if (!validateEmail(text)) {
        setLoginError('Enter a valid email or phone number');
      } else {
        setLoginError('');
      }
    }
  };

  const handleLoginBlur = () => {
    setLoginTouched(true);
    if (login.trim() && !validateEmail(login)) {
      setLoginError('Enter a valid email or phone number');
    } else {
      setLoginError('');
    }
  };

  const isValid = login.trim().length > 0 && password.trim().length > 0 && !loginError && validateEmail(login);

  const handleLogin = () => {
    if (!isValid) return;
    onLogin(login, password);
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
              label="Login"
              placeholder="Phone or email"
              value={login}
              onChangeText={handleLoginChange}
              onBlur={handleLoginBlur}
              keyboardType="email-address"
              error={loginError || undefined}
            />

            <View style={styles.spacer} />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
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
