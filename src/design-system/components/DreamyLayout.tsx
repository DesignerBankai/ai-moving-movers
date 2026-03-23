/**
 * DreamyLayout — shared wrapper for the dreamy glassmorphism theme.
 *
 * Provides:
 *  - Gradient background (DREAMY_BG)
 *  - Floating animated blobs (DreamyBlobs)
 *  - Glass card style tokens (glassCard, glassCardStrong, glassCardSubtle)
 *
 * Usage:
 *   import { DreamyLayout, glassCard, glassCardStrong } from '../../design-system';
 *   <DreamyLayout>
 *     <View style={glassCard}> ... </View>
 *   </DreamyLayout>
 */

import React, { useEffect } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';

/* ═══════════════════════════════════════════
   Design Tokens
   ═══════════════════════════════════════════ */

export const DREAMY_BG =
  'linear-gradient(180deg, #EFF8FF 0%, #EFF8FF 15%, #EFF8FF 30%, #D1E9FF 55%, #B2DDFF 80%, #D1E9FF 100%)';

/** Glass card base */
export const glassCard: any = Platform.OS === 'web' ? {
  backgroundColor: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: 24,
  border: '1px solid rgba(255,255,255,0.6)',
  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
} : {
  backgroundColor: 'rgba(255,255,255,0.7)',
  borderRadius: 24,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.6)',
};

/** Glass card — stronger blur, more opaque */
export const glassCardStrong: any = Platform.OS === 'web' ? {
  ...glassCard,
  backgroundColor: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
} : {
  ...glassCard,
  backgroundColor: 'rgba(255,255,255,0.8)',
};

/** Glass card — subtle, for inputs / secondary containers */
export const glassCardSubtle: any = Platform.OS === 'web' ? {
  backgroundColor: 'rgba(255,255,255,0.35)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.45)',
  boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
} : {
  backgroundColor: 'rgba(255,255,255,0.5)',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.45)',
};

/** Glass input field style */
export const glassInput: any = Platform.OS === 'web' ? {
  backgroundColor: 'rgba(255,255,255,0.5)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.5)',
} : {
  backgroundColor: 'rgba(255,255,255,0.6)',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.5)',
};

/** Glass navbar style */
export const glassNavbar: any = Platform.OS === 'web' ? {
  backgroundColor: 'transparent',
} : {
  backgroundColor: 'transparent',
};

/* ═══════════════════════════════════════════
   DreamyBlobs — animated floating circles
   ═══════════════════════════════════════════ */

const DreamyBlobs: React.FC = () => {
  if (Platform.OS !== 'web') return null;

  const cssId = 'dreamy-blobs-css';
  useEffect(() => {
    if (document.getElementById(cssId)) return;
    const style = document.createElement('style');
    style.id = cssId;
    style.textContent = `
      @keyframes blobFloat1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -20px) scale(1.05); }
        66% { transform: translate(-15px, 15px) scale(0.97); }
      }
      @keyframes blobFloat2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(-25px, 20px) scale(1.08); }
        66% { transform: translate(20px, -10px) scale(0.95); }
      }
      @keyframes blobFloat3 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(15px, 25px) scale(1.04); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{
      position: 'absolute' as const,
      top: 0, left: 0, right: 0, bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none' as const,
      zIndex: 0,
    }}>
      <div style={{
        position: 'absolute' as const,
        top: -60, left: -40,
        width: 220, height: 220,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46,144,250,0.2) 0%, transparent 70%)',
        animation: 'blobFloat1 12s ease-in-out infinite',
        filter: 'blur(30px)',
      }} />
      <div style={{
        position: 'absolute' as const,
        top: 40, right: -30,
        width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(21,112,239,0.18) 0%, transparent 70%)',
        animation: 'blobFloat2 15s ease-in-out infinite',
        filter: 'blur(30px)',
      }} />
      <div style={{
        position: 'absolute' as const,
        top: 200, left: '30%',
        width: 180, height: 180,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(83,177,253,0.2) 0%, transparent 70%)',
        animation: 'blobFloat3 10s ease-in-out infinite',
        filter: 'blur(25px)',
      }} />
      <div style={{
        position: 'absolute' as const,
        bottom: 100, right: 10,
        width: 160, height: 160,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(132,202,255,0.25) 0%, transparent 70%)',
        animation: 'blobFloat1 14s ease-in-out infinite reverse',
        filter: 'blur(25px)',
      }} />
    </div>
  );
};

/* ═══════════════════════════════════════════
   DreamyLayout — the wrapper
   ═══════════════════════════════════════════ */

interface DreamyLayoutProps {
  children: React.ReactNode;
  /** Show floating blobs (default true) */
  blobs?: boolean;
  /** Use ScrollView wrapper (default true) */
  scroll?: boolean;
  /** Extra content at bottom outside scroll (e.g. fixed button) */
  footer?: React.ReactNode;
  /** Extra style for scroll content */
  contentStyle?: any;
  /** Disable safe area (for screens that handle it themselves) */
  noSafeArea?: boolean;
}

export const DreamyLayout: React.FC<DreamyLayoutProps> = ({
  children,
  blobs = true,
  scroll = true,
  footer,
  contentStyle,
  noSafeArea = false,
}) => {
  const bgStyle: any = Platform.OS === 'web'
    ? { background: DREAMY_BG }
    : { backgroundColor: '#EFF8FF' };

  const Wrapper = noSafeArea ? View : SafeAreaView;

  return (
    <Wrapper style={[styles.container, bgStyle]}>
      {blobs && <DreamyBlobs />}
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.noScrollContent, contentStyle]}>
          {children}
        </View>
      )}
      {footer}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative' as any,
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  noScrollContent: {
    flex: 1,
    zIndex: 1,
  },
});
