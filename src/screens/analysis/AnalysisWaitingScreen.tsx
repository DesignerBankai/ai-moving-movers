/**
 * AI Moving — Analysis Waiting Screen (Redesigned)
 *
 * Modern, clean waiting experience while AI analyzes move videos.
 * Design: #FAFAFA bg, white cards, fontFamily.primary, blue accents.
 *
 * Hero: breathing blue circle that scales up/down smoothly.
 * Steps: active step has a pulsing icon glow animation.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Pressable,
  Platform,
} from 'react-native';
import { Text, StatusBarMock, Navbar } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';

const font = fontFamily.primary;

/* ═══════════════════════════════════════════
   Props
   ═══════════════════════════════════════════ */

interface AnalysisWaitingScreenProps {
  onSkip: () => void;
  onBack: () => void;
  onAnalysisComplete: () => void;
}

/* ═══════════════════════════════════════════
   Breathing circle — classic loader
   Scales smoothly between 0.85 → 1.15
   ═══════════════════════════════════════════ */

const BreathingCircle: React.FC = () => {
  // Single continuous driver 0→1, looped. Interpolate for smooth sine-like breathing.
  const driver = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(driver, {
        toValue: 1,
        duration: 4400,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      }),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // 0 → 0.5 → 1  maps to  small → big → small (seamless loop)
  const outerScale = driver.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 1.25, 0.7],
  });
  const outerOpacity = driver.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.22, 0.08, 0.22],
  });
  const thirdScale = driver.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.75, 1.2, 0.75],
  });
  const thirdOpacity = driver.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.32, 0.12, 0.32],
  });
  const middleScale = driver.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.15, 0.8],
  });
  const middleOpacity = driver.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.45, 0.2, 0.45],
  });

  return (
    <View style={styles.breathingContainer}>
      {/* Outer ring — breathes */}
      <Animated.View style={[
        styles.breathingOuter,
        { transform: [{ scale: outerScale }], opacity: outerOpacity },
      ]} />
      {/* Third ring — breathes between outer and middle */}
      <Animated.View style={[
        styles.breathingThird,
        { transform: [{ scale: thirdScale }], opacity: thirdOpacity },
      ]} />
      {/* Middle ring — breathes slightly offset */}
      <Animated.View style={[
        styles.breathingMiddle,
        { transform: [{ scale: middleScale }], opacity: middleOpacity },
      ]} />
      {/* Center icon — static */}
      <View style={styles.heroIconCenter}>
        {Platform.OS === 'web' ? (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
              fill={colors.primary[500]} fillOpacity="0.15"
              stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        ) : (
          <Text variant="h2" color={colors.primary[500]}>✦</Text>
        )}
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Progress steps
   ═══════════════════════════════════════════ */

const STEPS = [
  { id: 'video', label: 'Processing video recordings', icon: 'video' },
  { id: 'items', label: 'Identifying furniture & items', icon: 'scan' },
  { id: 'volume', label: 'Calculating volume & weight', icon: 'calc' },
  { id: 'estimate', label: 'Preparing your estimate', icon: 'doc' },
];

const STEP_TIMINGS = [0, 3000, 7000, 11000];

/* Step icons — 24×24 */
const StepIconVideo = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="14" height="14" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M16 10L22 7V17L16 14" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const StepIconScan = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 7V5C3 3.9 3.9 3 5 3H7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 3H19C20.1 3 21 3.9 21 5V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 17V19C21 20.1 20.1 21 19 21H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 21H5C3.9 21 3 20.1 3 19V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 12H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const StepIconCalc = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M8 6H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="1" fill={color} />
    <circle cx="12" cy="11" r="1" fill={color} />
    <circle cx="16" cy="11" r="1" fill={color} />
    <circle cx="8" cy="15" r="1" fill={color} />
    <circle cx="12" cy="15" r="1" fill={color} />
    <circle cx="16" cy="15" r="1" fill={color} />
    <circle cx="8" cy="19" r="1" fill={color} />
    <circle cx="12" cy="19" r="1" fill={color} />
    <path d="M15 18L17 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const StepIconDoc = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 2V8H20" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 13H16M8 17H13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const StepCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={colors.primary[500]} />
    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const STEP_ICON_MAP: Record<string, React.FC<{ color: string }>> = {
  video: StepIconVideo,
  scan: StepIconScan,
  calc: StepIconCalc,
  doc: StepIconDoc,
};

/* ═══════════════════════════════════════════
   Shimmer overlay for active step (web only)
   A light sweep moving left→right in a loop
   ═══════════════════════════════════════════ */

const ActiveShimmer: React.FC = () => {
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      }),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  if (Platform.OS !== 'web') return null;

  return (
    <Animated.View style={[
      styles.shimmerOverlay,
      {
        transform: [{
          translateX: translateX.interpolate({
            inputRange: [-1, 1],
            outputRange: [-200, 400],
          }),
        }],
      },
    ]}>
      <div style={{
        width: 120,
        height: '100%',
        background: `linear-gradient(90deg, transparent 0%, rgba(46,144,250,0.06) 40%, rgba(46,144,250,0.10) 50%, rgba(46,144,250,0.06) 60%, transparent 100%)`,
      } as any} />
    </Animated.View>
  );
};

/* ═══════════════════════════════════════════
   Step row with animated active state
   - Shimmer sweep across active row background
   - Icon breathes (scale 1→1.15→1) when active
   - Pulse ring radiates outward from icon
   ═══════════════════════════════════════════ */

const StepRow: React.FC<{
  step: typeof STEPS[0];
  index: number;
  currentStep: number;
  isLast: boolean;
}> = ({ step, index, currentStep, isLast }) => {
  // Appear animation
  const opacity = useRef(new Animated.Value(index === 0 ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(index === 0 ? 0 : 10)).current;

  // Active: icon breathing scale
  const iconScale = useRef(new Animated.Value(1)).current;
  // Active: pulse ring
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (index === 0) return;
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(translateY, { toValue: 0, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
      ]).start();
    }, STEP_TIMINGS[index]);
    return () => clearTimeout(timeout);
  }, []);

  const done = index < currentStep;
  const active = index === currentStep;

  // Icon breathing + pulse ring when active
  useEffect(() => {
    if (active) {
      // Breathing icon
      const breathe = Animated.loop(
        Animated.sequence([
          Animated.timing(iconScale, { toValue: 1.15, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
          Animated.timing(iconScale, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
        ]),
      );
      // Pulse ring
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseScale, { toValue: 1.6, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
            Animated.timing(pulseOpacity, { toValue: 0, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
          ]),
          Animated.parallel([
            Animated.timing(pulseScale, { toValue: 1, duration: 0, useNativeDriver: Platform.OS !== 'web' }),
            Animated.timing(pulseOpacity, { toValue: 0.35, duration: 0, useNativeDriver: Platform.OS !== 'web' }),
          ]),
        ]),
      );
      breathe.start();
      pulse.start();
      return () => { breathe.stop(); pulse.stop(); };
    } else {
      iconScale.setValue(1);
      pulseScale.setValue(1);
      pulseOpacity.setValue(0);
    }
  }, [active]);

  const iconColor = done ? colors.primary[500] : active ? colors.primary[500] : colors.gray[300];
  const IconComp = STEP_ICON_MAP[step.icon];

  return (
    <Animated.View style={[
      styles.stepRow,
      !isLast && styles.stepRowBorder,
      active && styles.stepRowActive,
      { opacity, transform: [{ translateY }] },
    ]}>
      {/* Shimmer sweep on active row */}
      {active && <ActiveShimmer />}

      <View style={{ position: 'relative', width: 44, height: 44, alignItems: 'center', justifyContent: 'center' } as any}>
        {/* Pulse ring behind active icon */}
        {active && (
          <Animated.View style={[
            styles.stepPulseRing,
            { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
          ]} />
        )}
        <Animated.View style={[
          styles.stepIconWrap,
          done && styles.stepIconDone,
          active && styles.stepIconActive,
          active && { transform: [{ scale: iconScale }] },
        ]}>
          {done ? <StepCheckIcon /> : <IconComp color={iconColor} />}
        </Animated.View>
      </View>
      {Platform.OS === 'web' ? (
        <span style={{
          fontFamily: font,
          fontSize: 16,
          fontWeight: active ? 600 : 400,
          color: done ? colors.gray[900] : active ? colors.gray[900] : colors.gray[400],
          flex: 1,
        } as any}>{step.label}</span>
      ) : (
        <Text variant="bodySm" color={active ? '#212225' : colors.gray[400]}>{step.label}</Text>
      )}
    </Animated.View>
  );
};

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const AnalysisWaitingScreen: React.FC<AnalysisWaitingScreenProps> = ({
  onSkip,
  onBack,
  onAnalysisComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers = STEP_TIMINGS.map((time, idx) =>
      setTimeout(() => setCurrentStep(idx), time),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Elapsed timer
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (s: number): string => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />
        <Navbar
          title=""
          onBack={onBack}
          rightAction={
            <Pressable
              onPress={onSkip}
              hitSlop={12}
              style={({ pressed }) => [pressed && { opacity: 0.5 }]}
            >
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: font, fontSize: 14, fontWeight: 500,
                  color: colors.primary[500],
                } as any}>Skip</span>
              ) : (
                <Text variant="bodySm" color={colors.primary[500]}>Skip</Text>
              )}
            </Pressable>
          }
        />

        <View style={styles.scrollContent}>
          {/* ── Hero area ── */}
          <View style={styles.heroArea}>
            <BreathingCircle />

            {Platform.OS === 'web' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 } as any}>
                <span style={{
                  fontFamily: font, fontSize: 24, fontWeight: 700,
                  color: colors.gray[900], textAlign: 'center',
                } as any}>Analyzing Your Move · {formatElapsed(elapsed)}</span>
                <span style={{
                  fontFamily: font, fontSize: 15, fontWeight: 400,
                  color: colors.gray[400], textAlign: 'center', lineHeight: '22px',
                } as any}>Analysis usually takes around 30 minutes.{'\n'}We'll notify you when it's ready</span>
              </div>
            ) : (
              <View style={{ alignItems: 'center', gap: 8 }}>
                <Text variant="h2" color="#212225">Analyzing Your Move · {formatElapsed(elapsed)}</Text>
                <Text variant="bodySm" color={colors.gray[400]}>
                  Analysis usually takes around 30 minutes. We'll notify you when it's ready
                </Text>
              </View>
            )}
          </View>

          {/* ── Steps card ── */}
          <View style={styles.stepsCard}>
            {STEPS.map((step, idx) => (
              <StepRow
                key={step.id}
                step={step}
                index={idx}
                currentStep={currentStep}
                isLast={idx === STEPS.length - 1}
              />
            ))}
          </View>

          {/* ── Bottom note ── */}
          <View style={styles.bottomNote}>
            {Platform.OS === 'web' ? (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span style={{
                  fontFamily: font, fontSize: 13, fontWeight: 400,
                  color: colors.gray[400], lineHeight: '18px',
                } as any}>You can close the app — we'll notify you when ready</span>
              </div>
            ) : (
              <Text variant="bodySm" color={colors.gray[400]}>
                You can close the app — we'll notify you when ready
              </Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' } as any,
  container: { flex: 1 },

  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /* Hero — breathing circle */
  heroArea: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    gap: 20,
  },
  breathingContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingOuter: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.primary[100],
  } as any,
  breathingThird: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: colors.primary[100],
  } as any,
  breathingMiddle: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary[100],
  } as any,
  heroIconCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? {} : {}),
  } as any,

  /* Steps card */
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignSelf: 'stretch',
    overflow: 'hidden',
  } as any,
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
    position: 'relative',
    overflow: 'hidden',
  } as any,
  stepRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  stepRowActive: {
    backgroundColor: 'rgba(46,144,250,0.03)',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  } as any,
  stepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  } as any,
  stepIconDone: {
    backgroundColor: 'transparent',
  },
  stepIconActive: {
    backgroundColor: colors.primary[50],
  },
  stepPulseRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[200],
  } as any,

  /* Bottom note */
  bottomNote: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
