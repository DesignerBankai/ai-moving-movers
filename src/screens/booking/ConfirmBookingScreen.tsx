/**
 * AI Moving — Confirm Booking Screen
 *
 * Summary before payment: mover card, route, date, plan,
 * total price, deposit (20%), remaining. CTA → "Pay Deposit".
 */

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBarMock, Navbar, Button, DREAMY_BG } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface ConfirmBookingScreenProps {
  moverName: string;
  moverRating: number;
  moverReviews: number;
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  planName: string;
  totalPrice: number;
  onPayDeposit: () => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const ic = colors.gray[400];

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F79009" stroke="#F79009" strokeWidth="1" />
  </svg>
);

const MapPinIcon = ({ color = ic }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 10C21 15.52 12 22 12 22C12 22 3 15.52 3 10C3 5.03 7.03 1 12 1C16.97 1 21 5.03 21 10Z" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.5" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={ic} strokeWidth="1.5" />
    <path d="M3 10H21" stroke={ic} strokeWidth="1.5" />
    <path d="M8 2V6M16 2V6" stroke={ic} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BoxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 8L12 2L3 8V16L12 22L21 16V8Z" stroke={ic} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 22V12" stroke={ic} strokeWidth="1.5" />
    <path d="M3 8L12 14L21 8" stroke={ic} strokeWidth="1.5" />
  </svg>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const ConfirmBookingScreen: React.FC<ConfirmBookingScreenProps> = ({
  moverName,
  moverRating,
  moverReviews,
  fromAddress,
  toAddress,
  moveDate,
  planName,
  totalPrice,
  onPayDeposit,
  onBack,
}) => {
  const deposit = Math.round(totalPrice * 0.2);
  const remaining = totalPrice - deposit;

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />
        <Navbar title="Confirm Booking" onBack={onBack} />

        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
          {/* === Mover Card === */}
          <View style={s.card}>
            <View style={s.moverRow}>
              <View style={s.avatar}>
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 18, fontWeight: 700, color: colors.primary[500] } as any}>
                    {moverName[0]}
                  </span>
                ) : null}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                {Platform.OS === 'web' ? (
                  <>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 600, color: colors.gray[900] } as any}>
                      {moverName}
                    </span>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                      <StarIcon />
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 500, color: colors.gray[900], marginLeft: 4 } as any}>
                        {moverRating}
                      </span>
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[400], marginLeft: 4 } as any}>
                        ({moverReviews} reviews)
                      </span>
                    </View>
                  </>
                ) : null}
              </View>
            </View>
          </View>

          {/* === Details === */}
          <View style={s.card}>
            {[
              { icon: <MapPinIcon color={colors.primary[500]} />, label: 'From', value: fromAddress },
              { icon: <MapPinIcon color={colors.error[400]} />, label: 'To', value: toAddress },
              { icon: <CalendarIcon />, label: 'Date', value: moveDate },
              { icon: <BoxIcon />, label: 'Plan', value: planName },
            ].map((row, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={s.divider} />}
                <View style={s.detailRow}>
                  {Platform.OS === 'web' && row.icon}
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    {Platform.OS === 'web' ? (
                      <>
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 500, color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.5 } as any}>
                          {row.label}
                        </span>
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 500, color: colors.gray[900], marginTop: 2 } as any}>
                          {row.value}
                        </span>
                      </>
                    ) : null}
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* === Price Breakdown === */}
          <View style={s.card}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 700, color: colors.gray[900], marginBottom: 14 } as any}>
                Price Summary
              </span>
            ) : null}

            <View style={s.priceRow}>
              {Platform.OS === 'web' ? (
                <>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 400, color: colors.gray[500] } as any}>
                    Total Estimate
                  </span>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: colors.gray[900] } as any}>
                    ${totalPrice.toLocaleString()}
                  </span>
                </>
              ) : null}
            </View>

            <View style={s.divider} />

            <View style={s.priceRow}>
              {Platform.OS === 'web' ? (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 500, color: colors.primary[500] } as any}>
                      Deposit (20%)
                    </span>
                  </View>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 18, fontWeight: 700, color: colors.primary[500] } as any}>
                    ${deposit}
                  </span>
                </>
              ) : null}
            </View>

            <View style={s.priceRow}>
              {Platform.OS === 'web' ? (
                <>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[400] } as any}>
                    Remaining (due on move day)
                  </span>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 500, color: colors.gray[500] } as any}>
                    ${remaining.toLocaleString()}
                  </span>
                </>
              ) : null}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* === Bottom CTA === */}
        <View style={s.bottom}>
          <Button title={`Pay Deposit — $${deposit}`} variant="primary" onPress={onPayDeposit} />
        </View>
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
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flex: 1, paddingHorizontal: 16 },

  card: {
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)' }),
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  } as any,
  moverRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.primary[50],
    alignItems: 'center', justifyContent: 'center',
  },

  detailRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
  },
  divider: {
    height: 1, backgroundColor: colors.gray[100],
  },

  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8,
  },

  bottom: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: colors.gray[100],
  },
});
