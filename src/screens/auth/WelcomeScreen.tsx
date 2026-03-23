/**
 * AI Moving — Welcome Screen (Screen 1)
 *
 * Entry point from landing page CTA.
 * Shows logo/brand and two actions:
 * - "Get Started" → registration flow
 * - "I have an Account" → login flow
 *
 * Features animated gradient background in brand colors.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Text, Button } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { spacing } from '../../design-system/tokens/spacing';

/* ═══════════════════════════════════════════
   Animated Gradient Background (web only)
   ═══════════════════════════════════════════ */

const GRADIENT_CSS = `
@keyframes aiMovingGradient {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 50% 100%;
  }
  50% {
    background-position: 100% 50%;
  }
  75% {
    background-position: 50% 0%;
  }
  100% {
    background-position: 0% 50%;
  }
}
`;

const AnimatedGradientBg: React.FC = () => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const id = 'ai-moving-gradient-style';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = GRADIENT_CSS;
      document.head.appendChild(style);
    }
  }, []);

  if (Platform.OS !== 'web') return null;

  return (
    <div style={{
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(
        -45deg,
        ${colors.primary[700]},
        ${colors.primary[500]},
        ${colors.primary[400]},
        ${colors.primary[600]},
        #1A56DB,
        ${colors.primary[500]},
        ${colors.primary[300]},
        ${colors.primary[700]}
      )`,
      backgroundSize: '400% 400%',
      animation: 'aiMovingGradient 12s ease infinite',
    } as any} />
  );
};

/* ═══════════════════════════════════════════
   Welcome Screen
   ═══════════════════════════════════════════ */

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onHaveAccount: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onHaveAccount,
}) => {
  return (
    <View style={styles.safeArea}>
      <AnimatedGradientBg />
      <SafeAreaView style={{ flex: 1, zIndex: 5 } as any}>
        <View style={styles.container}>
          {/* Logo / Brand area */}
          <View style={styles.brandContainer}>
            {Platform.OS === 'web' ? (
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 42,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                textAlign: 'center' as const,
                textShadow: '0 2px 20px rgba(0,0,0,0.15)',
              } as any}>AI Moving</span>
            ) : (
              <Text variant="h1" color="#FFFFFF" align="center">
                AI Moving
              </Text>
            )}
          </View>

          {/* Bottom actions */}
          <View style={styles.actionsContainer}>
            {Platform.OS === 'web' ? (
              <>
                {/* Get Started — white button */}
                <div
                  onClick={onGetStarted}
                  style={{
                    display: 'flex',
                    alignItems: 'center' as const,
                    justifyContent: 'center' as const,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  }}
                  onMouseEnter={(e: any) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <span style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: 16,
                    fontWeight: 600,
                    color: colors.primary[600],
                  }}>Get Started</span>
                </div>

                {/* I have an Account — transparent/outlined button */}
                <div
                  onClick={onHaveAccount}
                  style={{
                    display: 'flex',
                    alignItems: 'center' as const,
                    justifyContent: 'center' as const,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '1.5px solid rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, background-color 0.2s ease',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  } as any}
                  onMouseEnter={(e: any) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <span style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#FFFFFF',
                  }}>I have an Account</span>
                </div>
              </>
            ) : (
              <>
                <Button title="Get Started" variant="primary" onPress={onGetStarted} />
                <Button title="I have an Account" variant="secondary" onPress={onHaveAccount} />
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary[600],
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing[4],
    justifyContent: 'space-between',
  },

  brandContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionsContainer: {
    gap: spacing[3],
    paddingBottom: spacing[8],
  },
});
