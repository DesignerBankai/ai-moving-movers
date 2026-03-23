/**
 * AI Moving — Booking Confirmed Screen
 *
 * Shown after successful deposit payment.
 * Design: #FAFAFA bg, breathing circle animation (like AnalysisWaitingScreen),
 * white cards, blue accents, no borders/shadows.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  Animated,
  Easing,
  ScrollView,
  Pressable,
} from 'react-native';
import { StatusBarMock, Navbar } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';

const font = fontFamily.primary;

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface BookingConfirmedScreenProps {
  moverName: string;
  moveDate: string;
  depositAmount?: number;
  remainingAmount?: number;
  totalAmount?: number;
  remainingPayDate?: string;
  onChatWithMover: () => void;
  onViewDetails: () => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

/* ═══════════════════════════════════════════
   Breathing Success Circle
   Similar to AnalysisWaitingScreen but with
   a checkmark icon in the center
   ═══════════════════════════════════════════ */

const BreathingSuccessCircle: React.FC = () => {
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
      <Animated.View style={[
        styles.breathingOuter,
        { transform: [{ scale: outerScale }], opacity: outerOpacity },
      ]} />
      <Animated.View style={[
        styles.breathingThird,
        { transform: [{ scale: thirdScale }], opacity: thirdOpacity },
      ]} />
      <Animated.View style={[
        styles.breathingMiddle,
        { transform: [{ scale: middleScale }], opacity: middleOpacity },
      ]} />
      {/* Center — checkmark */}
      <View style={styles.heroIconCenter}>
        {Platform.OS === 'web' ? (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M5 13L10 18L20 6" stroke={colors.primary[500]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Price Row — like TariffConfirmScreen
   ═══════════════════════════════════════════ */

const PriceRow: React.FC<{
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
  isLast?: boolean;
}> = ({ label, value, bold, highlight, isLast }) => (
  <div style={{
    display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center',
    paddingTop: bold ? 18 : 16, paddingBottom: bold ? 18 : 16,
    paddingLeft: 20, paddingRight: 20,
    borderBottom: isLast ? 'none' : '1px solid #F2F4F7',
    backgroundColor: highlight ? '#DBEAFE' : 'transparent',
    borderRadius: isLast ? '0 0 16px 16px' : 0,
  } as any}>
    <span style={{
      fontFamily: font,
      fontSize: bold ? 16 : 15,
      fontWeight: bold ? 700 : 500,
      color: bold ? colors.gray[900] : colors.gray[500],
    } as any}>{label}</span>
    <span style={{
      fontFamily: font,
      fontSize: bold ? 17 : 15,
      fontWeight: bold ? 700 : 600,
      color: highlight ? colors.primary[600] : colors.gray[900],
    } as any}>{value}</span>
  </div>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const BookingConfirmedScreen: React.FC<BookingConfirmedScreenProps> = ({
  moverName,
  moveDate,
  depositAmount = 268,
  remainingAmount = 1072,
  totalAmount = 1340,
  remainingPayDate = 'day before your move',
  onChatWithMover,
  onViewDetails,
  onBack,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(checkScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: Platform.OS !== 'web',
      delay: 150,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      delay: 400,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      delay: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  if (Platform.OS !== 'web') return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock onTimeTap={onBack} />
        <Navbar title="" onBack={onBack} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Breathing circle with checkmark ── */}
          <Animated.View style={[styles.heroArea, { transform: [{ scale: checkScale }] }]}>
            <BreathingSuccessCircle />
          </Animated.View>

          {/* ── Title block ── */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <div style={{ textAlign: 'center', paddingLeft: 24, paddingRight: 24 } as any}>
              <span style={{
                fontFamily: font,
                fontSize: 28, fontWeight: 700, letterSpacing: -0.8,
                lineHeight: '34px',
                color: colors.gray[900],
                display: 'block',
              } as any}>
                Booking confirmed!
              </span>

              <span style={{
                fontFamily: font,
                fontSize: 15, fontWeight: 400,
                lineHeight: '22px', letterSpacing: -0.2,
                color: colors.gray[400],
                display: 'block', marginTop: 10, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto',
              } as any}>
                Your move with <span style={{ fontWeight: 600, color: colors.gray[600] } as any}>{moverName}</span> is booked for <span style={{ fontWeight: 600, color: colors.gray[600] } as any}>{moveDate}</span>
              </span>
            </div>
          </Animated.View>

          {/* ── Payment breakdown ── */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <div style={{ marginTop: 28, paddingLeft: 16, paddingRight: 16, display: 'flex', flexDirection: 'column' as const, gap: 10 } as any}>
              {/* Paid now */}
              <div style={{
                backgroundColor: '#FFFFFF', borderRadius: 16,
                paddingTop: 18, paddingBottom: 18, paddingLeft: 20, paddingRight: 20,
                display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center',
              } as any}>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 3 } as any}>
                  <span style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>
                    Deposit paid
                  </span>
                  <span style={{ fontFamily: font, fontSize: 13, fontWeight: 500, color: colors.gray[400] } as any}>
                    Charged today
                  </span>
                </div>
                <span style={{ fontFamily: font, fontSize: 17, fontWeight: 700, color: colors.gray[900] } as any}>
                  {fmt(depositAmount)}
                </span>
              </div>

              {/* Remaining — later */}
              <div style={{
                backgroundColor: '#FFFFFF', borderRadius: 16,
                paddingTop: 18, paddingBottom: 18, paddingLeft: 20, paddingRight: 20,
                display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center',
              } as any}>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 3 } as any}>
                  <span style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>
                    Remaining
                  </span>
                  <span style={{ fontFamily: font, fontSize: 13, fontWeight: 500, color: colors.gray[400] } as any}>
                    {remainingPayDate}
                  </span>
                </div>
                <span style={{ fontFamily: font, fontSize: 17, fontWeight: 700, color: colors.gray[900] } as any}>
                  {fmt(remainingAmount)}
                </span>
              </div>
            </div>
          </Animated.View>

          {/* ── Confirmation note ── */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <div style={{
              display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
              justifyContent: 'center', gap: 8, marginTop: 20, paddingLeft: 24, paddingRight: 24,
            } as any}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 6L13.5 15.5L8.5 10.5L2 17" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 6H22V12" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{
                fontFamily: font, fontSize: 13, color: colors.gray[400],
                lineHeight: '18px',
              } as any}>Confirmation sent to your email</span>
            </div>
          </Animated.View>

          <View style={{ height: 32 }} />
        </ScrollView>

        {/* ── Bottom CTAs ── */}
        <Animated.View style={[styles.bottom, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Pressable
            onPress={onChatWithMover}
            style={({ pressed }) => [{
              alignItems: 'center' as const, justifyContent: 'center' as const,
              paddingVertical: 18, borderRadius: 16,
              backgroundColor: colors.primary[500],
            }, pressed && { opacity: 0.85 }]}
          >
            <span style={{
              fontFamily: font, fontSize: 17, fontWeight: 700,
              color: '#FFFFFF', letterSpacing: -0.2,
            } as any}>Chat with Your Mover</span>
          </Pressable>

          <View style={{ height: 10 }} />

          <Pressable
            onPress={onViewDetails}
            style={({ pressed }) => [{
              alignItems: 'center' as const, justifyContent: 'center' as const,
              paddingVertical: 18, borderRadius: 16,
              backgroundColor: '#EFF2F7',
            }, pressed && { opacity: 0.7 }]}
          >
            <span style={{
              fontFamily: font, fontSize: 17, fontWeight: 700,
              color: colors.gray[700], letterSpacing: -0.2,
            } as any}>View Move Details</span>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  } as any,
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingTop: 0,
  },
  heroArea: {
    alignItems: 'center' as const,
    alignSelf: 'center' as const,
    paddingTop: 8,
  },
  bottom: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },

  /* Breathing circle — same dimensions as AnalysisWaitingScreen */
  breathingContainer: {
    width: 180,
    height: 180,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  breathingOuter: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colors.primary[100],
  } as any,
  breathingThird: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: colors.primary[100],
  } as any,
  breathingMiddle: {
    position: 'absolute',
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: colors.primary[100],
  } as any,
  heroIconCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as any,
});
