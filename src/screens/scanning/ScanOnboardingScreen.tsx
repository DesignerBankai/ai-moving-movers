/**
 * AI Moving — Scan Onboarding Screen (Screen 8)
 *
 * Top half: blue gradient. Bottom half: white.
 * Vertical auto-carousel centered in the screen.
 * Active item = large simple icon + title + description.
 * Inactive = small muted icon + muted title.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  StatusBarMock,
  Navbar,
} from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { DesktopQRScreen } from '../../components/DesktopQRScreen';
import { useIsDesktop } from '../../hooks/useIsDesktop';

/* ── CSS ── */
const ANIM_ID = 'scan-onb-v6';
function injectCSS() {
  if (Platform.OS !== 'web') return;
  if (document.getElementById(ANIM_ID)) return;
  const s = document.createElement('style');
  s.id = ANIM_ID;
  s.textContent = `
    @keyframes onbDescReveal {
      0% { opacity: 0; max-height: 0; margin-top: 0; transform: translateY(-4px); }
      100% { opacity: 1; max-height: 80px; margin-top: 8px; transform: translateY(0); }
    }
  `;
  document.head.appendChild(s);
}

/* ── Data ── */
const STEPS = [
  {
    title: 'Scan each room',
    desc: 'Point the camera at your belongings. Our AI detects items in real time.',
  },
  {
    title: 'AI identifies items',
    desc: 'Furniture and boxes recognized automatically with size estimation.',
  },
  {
    title: 'Get your estimate',
    desc: 'Receive an accurate moving cost based on your inventory.',
  },
];

const INTERVAL = 4000;

/* ── Simple Icons — minimal strokes ── */

const ScanSVG = ({ active, size, color }: { active: boolean; size: number; color: string }) => {
  const o = active ? 1 : 0.4;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ opacity: o, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <path d="M5 10 V5 H10" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M22 5 H27 V10" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M27 22 V27 H22" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M10 27 H5 V22" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="8" y1="16" x2="24" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

const AiSVG = ({ active, size, color }: { active: boolean; size: number; color: string }) => {
  const o = active ? 1 : 0.4;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ opacity: o, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <path d="M16 4 L18.5 12.5 L27 16 L18.5 19.5 L16 28 L13.5 19.5 L5 16 L13.5 12.5 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  );
};

const EstSVG = ({ active, size, color }: { active: boolean; size: number; color: string }) => {
  const o = active ? 1 : 0.4;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ opacity: o, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <rect x="7" y="6" width="18" height="22" rx="3" stroke={color} strokeWidth="2" fill="none" />
      <rect x="12" y="3" width="8" height="6" rx="2" stroke={color} strokeWidth="1.8" fill="none" />
      <path d="M11 17 L15 21 L21 13" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};

const ICONS = [ScanSVG, AiSVG, EstSVG];

/* ── Screen ── */
interface ScanOnboardingScreenProps {
  onStartScanning: () => void;
  onBack: () => void;
}

export const ScanOnboardingScreen: React.FC<ScanOnboardingScreenProps> = ({
  onStartScanning,
  onBack,
}) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) return <DesktopQRScreen onBack={onBack} />;
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const injected = useRef(false);

  useEffect(() => { if (!injected.current) { injectCSS(); injected.current = true; } }, []);

  const advance = useCallback(() => setActive((p) => (p + 1) % 3), []);

  useEffect(() => {
    timerRef.current = setTimeout(advance, INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, advance]);

  const tap = useCallback((i: number) => {
    if (i === active) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setActive(i);
  }, [active]);

  if (Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.wrap}>
          <StatusBarMock />
          <Navbar onBack={onBack} />
          <View style={{ flex: 1, padding: 24 }}>
            <Text variant="h2" color="white">Scan Your Items</Text>
          </View>
          <View style={styles.btnWrap}>
            <Button title="Start Scanning" variant="primary" onPress={onStartScanning} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column' as const,
          position: 'relative' as const,
          overflow: 'hidden' as const,
        }}>
          {/* Full-height gradient: blue top → white bottom */}
          <div style={{
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(180deg, #1A56DB 0%, #1C64F2 12%, ${colors.primary[500]} 22%, #3B9CFF 30%, #6CB4FB 38%, #B8DBFE 44%, #E8F2FF 50%, white 58%)`,
          }} />

          {/* Content */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column' as const,
            position: 'relative' as const,
            zIndex: 1,
          }}>
            <StatusBarMock variant="light" />
            {/* Nav */}
            <Navbar onBack={onBack} tintColor="white" />

            {/* Title */}
            <div style={{ padding: '4px 24px 0 24px' }}>
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 30, fontWeight: 700, color: 'white',
                letterSpacing: '-0.02em',
                lineHeight: '36px', display: 'block',
              }}>Scan Your Items</span>
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 15, fontWeight: 400,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '-0.02em',
                lineHeight: '22px', display: 'block', marginTop: 8,
              }}>Use your camera to create a detailed inventory and get an accurate estimate.</span>
            </div>

            {/* Vertical carousel — pushed down into white zone, ~50% of screen */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column' as const,
              justifyContent: 'flex-end' as const,
              padding: '0 24px',
              paddingBottom: 24,
              gap: 0,
            }}>
              {STEPS.map((step, i) => {
                const isAct = i === active;
                const Icon = ICONS[i];
                const iconSize = isAct ? 48 : 34;
                const iconColor = isAct ? colors.primary[500] : colors.gray[400];
                const titleColor = isAct ? colors.gray[900] : colors.gray[400];
                const descColor = colors.gray[500];

                if (isAct) {
                  /* Active: vertical — icon on top, title + desc below */
                  return (
                    <div
                      key={i}
                      onClick={() => tap(i)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column' as const,
                        gap: 4,
                        cursor: 'pointer',
                        padding: '16px 0',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <div style={{
                        width: 48, height: 48,
                        display: 'flex',
                        alignItems: 'center' as const,
                        justifyContent: 'center' as const,
                        marginLeft: -4,
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                        <Icon active={true} size={iconSize} color={iconColor} />
                      </div>
                      <div>
                        <span style={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: 22, fontWeight: 600,
                          color: titleColor,
                          letterSpacing: '-0.02em',
                          lineHeight: '28px', display: 'block',
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}>{step.title}</span>
                        <span
                          key={`d-${i}`}
                          style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: 14, fontWeight: 400,
                            color: descColor,
                            letterSpacing: '-0.02em',
                            lineHeight: '20px', display: 'block',
                            overflow: 'hidden',
                            animation: 'onbDescReveal 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                          }}
                        >{step.desc}</span>
                      </div>
                    </div>
                  );
                }

                /* Inactive: horizontal — icon left, title right */
                return (
                  <div
                    key={i}
                    onClick={() => tap(i)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row' as const,
                      alignItems: 'center' as const,
                      gap: 12,
                      cursor: 'pointer',
                      padding: '12px 0',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <div style={{
                      width: 34, height: 34,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center' as const,
                      justifyContent: 'center' as const,
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                      <Icon active={false} size={iconSize} color={iconColor} />
                    </div>
                    <span style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: 17, fontWeight: 500,
                      color: titleColor,
                      letterSpacing: '-0.02em',
                      lineHeight: '20px',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>{step.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Bottom button */}
            <div style={{ padding: '0 16px 32px 16px' }}>
              <div
                onClick={onStartScanning}
                style={{
                  width: '100%',
                  height: 52,
                  borderRadius: 14,
                  background: colors.primary[500],
                  display: 'flex',
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}
              >
                <span style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 16, fontWeight: 600,
                  color: 'white',
                }}>Start Scanning</span>
              </div>
            </div>
          </div>
        </div>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary[600] || '#1570DA' },
  wrap: { flex: 1 },
  btnWrap: { paddingHorizontal: 16, paddingBottom: 32 },
});
