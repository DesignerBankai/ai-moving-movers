/**
 * AI Moving — Application Sent Screen (Mover side)
 *
 * Simple success screen with animated checkmark.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBarMock, Button } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';

const F = fontFamily.primary as string;
const ANIM_ID = 'app-sent-anim';

interface ApplicationSentScreenProps {
  clientName: string;
  onViewOrders: () => void;
  onBackToDashboard: () => void;
}

export const ApplicationSentScreen: React.FC<ApplicationSentScreenProps> = ({
  clientName,
  onViewOrders,
  onBackToDashboard,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && !document.getElementById(ANIM_ID)) {
      const st = document.createElement('style');
      st.id = ANIM_ID;
      st.textContent = `
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes checkDraw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(st);
    }
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (Platform.OS !== 'web') return null;

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock />

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column' as const,
          alignItems: 'center', justifyContent: 'center', padding: 32,
        } as any}>

          {/* Animated checkmark */}
          <div style={{
            width: 96, height: 96, borderRadius: 48,
            backgroundColor: colors.success[50],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 32,
            animation: show ? 'checkPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
            opacity: show ? 1 : 0,
          } as any}>
            <div style={{
              width: 64, height: 64, borderRadius: 32,
              backgroundColor: colors.success[500],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            } as any}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 12L10 16L18 8"
                  stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    strokeDasharray: 24,
                    animation: show ? 'checkDraw 0.4s 0.3s ease forwards' : 'none',
                    strokeDashoffset: 24,
                  } as any}
                />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div style={{
            animation: show ? 'fadeSlideUp 0.4s 0.25s ease forwards' : 'none',
            opacity: 0,
            display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
          } as any}>
            <span style={{
              fontFamily: F, fontSize: 24, fontWeight: 700, color: colors.gray[900],
              letterSpacing: -0.48, textAlign: 'center' as const,
            } as any}>
              Application sent
            </span>

            <span style={{
              fontFamily: F, fontSize: 16, fontWeight: 400, color: colors.gray[500],
              letterSpacing: -0.32, textAlign: 'center' as const, marginTop: 10,
              lineHeight: '24px', maxWidth: 280,
            } as any}>
              We'll notify you when {clientName} responds to your offer.
            </span>
          </div>
        </div>

        {/* Bottom buttons */}
        <div style={{
          padding: '0 16px 32px', display: 'flex', flexDirection: 'column' as const, gap: 10,
          animation: show ? 'fadeSlideUp 0.4s 0.4s ease forwards' : 'none',
          opacity: 0,
        } as any}>
          <Button title="View my orders" onPress={onViewOrders} size="lg" />
          <div
            onClick={onBackToDashboard}
            style={{
              padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            } as any}
          >
            <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[500], letterSpacing: -0.3 } as any}>
              Back to dashboard
            </span>
          </div>
        </div>
      </View>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },
});
