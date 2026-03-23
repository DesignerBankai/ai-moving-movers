/**
 * AI Moving — Move Completed Screen
 *
 * Celebration state after move is done:
 * confetti-style icon, "Move Completed!" title,
 * stats (total paid, move duration, items moved),
 * "Leave a Review" (primary) + "Download Receipt" (secondary).
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { StatusBarMock, Button, DREAMY_BG } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface MoveCompletedScreenProps {
  moverName: string;
  totalPaid: number;
  moveDuration: string; // e.g. "4h 25m"
  itemsMoved: number;
  onLeaveReview: () => void;
  onBackToHome: () => void;
  onPayRemainder: () => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const PartyIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={colors.success[50]} stroke={colors.success[500]} strokeWidth="1.5" />
    <path d="M8 12L11 15L16 9" stroke={colors.success[500]} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ConfettiStar = ({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(anim, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
      ])
    ).start();
  }, []);
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 0.8, 0.2] });
  return (
    <Animated.View style={{ position: 'absolute', left: x, top: y, transform: [{ scale }], opacity }}>
      {Platform.OS === 'web' && (
        <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill={color} /></svg>
      )}
    </Animated.View>
  );
};

const DollarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={colors.gray[400]} strokeWidth="1.5" />
    <path d="M12 6V18M9 8.5C9 8.5 9.5 7 12 7C14.5 7 15 8.5 15 9.25C15 11 12 11 12 12.5C12 13.5 12.5 14 12 14C11.5 14 9 14.5 9 16" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={colors.gray[400]} strokeWidth="1.5" />
    <path d="M12 6V12L16 14" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21 8L12 2L3 8V16L12 22L21 16V8Z" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 22V12" stroke={colors.gray[400]} strokeWidth="1.5" />
    <path d="M3 8L12 14L21 8" stroke={colors.gray[400]} strokeWidth="1.5" />
  </svg>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const MoveCompletedScreen: React.FC<MoveCompletedScreenProps> = ({
  moverName,
  totalPaid,
  moveDuration,
  itemsMoved,
  onLeaveReview,
  onBackToHome,
  onPayRemainder,
  onBack,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1, friction: 5, tension: 80,
      useNativeDriver: Platform.OS !== 'web', delay: 150,
    }).start();
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 500, delay: 400,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    Animated.timing(slideAnim, {
      toValue: 0, duration: 400, delay: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />

        <View style={s.content}>
          {/* Confetti dots */}
          <View style={s.confettiWrap}>
            <ConfettiStar x={20} y={10} color={colors.primary[300]} delay={0} />
            <ConfettiStar x={140} y={5} color={colors.warning[300]} delay={300} />
            <ConfettiStar x={60} y={-10} color={colors.success[300]} delay={600} />
            <ConfettiStar x={110} y={20} color={colors.primary[400]} delay={200} />
            <ConfettiStar x={-10} y={30} color={colors.error[200]} delay={500} />
            <ConfettiStar x={160} y={35} color={colors.success[400]} delay={100} />
          </View>

          {/* Check icon */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            {Platform.OS === 'web' && <PartyIcon />}
          </Animated.View>

          <View style={{ height: 24 }} />

          {/* Title + subtitle */}
          <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
            {Platform.OS === 'web' ? (
              <>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 26, fontWeight: 700, color: colors.gray[900], textAlign: 'center' } as any}>
                  Move Completed!
                </span>
                <View style={{ height: 10 }} />
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, fontWeight: 400, color: colors.gray[500], textAlign: 'center', lineHeight: '22px', maxWidth: 300 } as any}>
                  Your move with {moverName} has been successfully completed
                </span>
              </>
            ) : null}
          </Animated.View>

          <View style={{ height: 32 }} />

          {/* Stats cards */}
          <Animated.View style={[s.statsRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {[
              { icon: <DollarIcon />, value: `$${totalPaid.toLocaleString()}`, label: 'Total Paid' },
              { icon: <ClockIcon />, value: moveDuration, label: 'Duration' },
              { icon: <BoxIcon />, value: String(itemsMoved), label: 'Items Moved' },
            ].map((stat, i) => (
              <View key={i} style={s.statCard}>
                {Platform.OS === 'web' && stat.icon}
                {Platform.OS === 'web' ? (
                  <>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 18, fontWeight: 700, color: colors.gray[900], marginTop: 8 } as any}>
                      {stat.value}
                    </span>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 400, color: colors.gray[400], marginTop: 2 } as any}>
                      {stat.label}
                    </span>
                  </>
                ) : null}
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Bottom buttons */}
        <Animated.View style={[s.bottom, { opacity: fadeAnim }]}>
          <Button title="Pay Remainder" variant="primary" onPress={onPayRemainder} />
          <View style={{ height: 10 }} />
          <Button title="Leave a Review" variant="secondary" onPress={onLeaveReview} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...(Platform.OS === 'web' ? { background: DREAMY_BG } : { backgroundColor: '#EFF8FF' }),
  } as any,
  container: { flex: 1, justifyContent: 'space-between', backgroundColor: 'transparent' },

  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 24,
  },

  confettiWrap: {
    position: 'absolute', top: '25%', left: '20%',
    width: 180, height: 60,
  },

  statsRow: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)' }),
    borderRadius: 14,
  } as any,

  bottom: { paddingHorizontal: 16, paddingBottom: 32 },
});
