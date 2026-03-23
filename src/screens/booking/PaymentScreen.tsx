/**
 * AI Moving — Payment Screen (Approve Offer)
 *
 * Uses design-system Input, Button, Navbar, glass cards.
 * Logic:
 *   - Move > 2 days away → pay 20% deposit now, 80% charged day before move
 *   - Move ≤ 2 days away → pay full amount now
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBarMock, Navbar, Button, Input, DREAMY_BG } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface PaymentScreenProps {
  offerPrice: number;
  moveDateStr: string;
  daysUntilMove: number;
  onPay: () => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const ic = colors.gray[400];

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke={ic} strokeWidth="1.5" />
    <path d="M2 10H22" stroke={ic} strokeWidth="1.5" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke={ic} strokeWidth="1.5" />
    <path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke={ic} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  offerPrice,
  moveDateStr,
  daysUntilMove,
  onPay,
  onBack,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const font = fontFamily.primary;

  const isFullPay = daysUntilMove <= 2;
  const deposit = Math.round(offerPrice * 0.2);
  const remaining = offerPrice - deposit;
  const payNow = isFullPay ? offerPrice : deposit;

  const formatCard = (val: string) => {
    const d = val.replace(/\D/g, '').slice(0, 16);
    return d.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    if (d.length > 2) return d.slice(0, 2) + '/' + d.slice(2);
    return d;
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />
        <Navbar title="Approve Offer" onBack={onBack} />

        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Payment Method title ── */}
          {Platform.OS === 'web' && (
            <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 8, marginTop: 16, marginBottom: 12 } as any}>
              <CreditCardIcon />
              <span style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: colors.gray[900] } as any}>Payment Method</span>
            </div>
          )}

          {/* ── Card inputs (design system Input — white bg, shadow, borderRadius 12) ── */}
          <Input
            label="Card Number"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChangeText={(t) => setCardNumber(formatCard(t))}
            keyboardType="number-pad"
          />

          <View style={{ height: 10 }} />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Input
                label="CVV"
                placeholder="•••"
                value={cvv}
                onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
                keyboardType="number-pad"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="MM/YY"
                placeholder="MM/YY"
                value={expiry}
                onChangeText={(t) => setExpiry(formatExpiry(t))}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* ── Price breakdown ── */}
          <View style={s.card}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: colors.gray[900], marginBottom: 14, display: 'block' } as any}>
                Price Summary
              </span>
            ) : null}

            {/* Total Estimate */}
            <View style={s.priceRow}>
              {Platform.OS === 'web' ? (
                <>
                  <span style={{ fontFamily: font, fontSize: 14, fontWeight: 400, color: colors.gray[500] } as any}>
                    Total Estimate
                  </span>
                  <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.gray[900] } as any}>
                    ${offerPrice.toLocaleString()}
                  </span>
                </>
              ) : null}
            </View>

            <View style={s.divider} />

            {/* Deposit (20%) */}
            <View style={s.priceRow}>
              {Platform.OS === 'web' ? (
                <>
                  <span style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: colors.primary[500] } as any}>
                    Deposit (20%)
                  </span>
                  <span style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: colors.primary[500] } as any}>
                    ${deposit.toLocaleString()}
                  </span>
                </>
              ) : null}
            </View>

            {/* Remaining */}
            <View style={s.priceRow}>
              {Platform.OS === 'web' ? (
                <>
                  <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: colors.gray[400] } as any}>
                    {isFullPay ? 'Charged now (full)' : 'Remaining (due day before move)'}
                  </span>
                  <span style={{ fontFamily: font, fontSize: 13, fontWeight: 500, color: colors.gray[500] } as any}>
                    ${remaining.toLocaleString()}
                  </span>
                </>
              ) : null}
            </View>
          </View>

          {/* ── Info note ── */}
          <View style={s.card}>
            {Platform.OS === 'web' && (
              <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'flex-start', gap: 8 } as any}>
                <div style={{ marginTop: 2, flexShrink: 0 } as any}><LockIcon /></div>
                <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: colors.gray[400], lineHeight: '19px' } as any}>
                  {isFullPay
                    ? `Your move is in ${daysUntilMove} day${daysUntilMove !== 1 ? 's' : ''} — full payment of $${offerPrice.toLocaleString()} is charged now. Your payment is encrypted and secure.`
                    : `You pay $${deposit.toLocaleString()} deposit now. The remaining $${remaining.toLocaleString()} will be charged one day before your move (${moveDateStr}). Your payment is encrypted and secure.`
                  }
                </span>
              </div>
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ── Bottom CTA ── */}
        <View style={s.bottom}>
          <Button
            title={isFullPay ? `Pay $${offerPrice.toLocaleString()}` : `Pay Deposit — $${deposit.toLocaleString()}`}
            variant="primary"
            onPress={onPay}
          />
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

  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1, backgroundColor: colors.gray[100],
  },

  bottom: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: colors.gray[100],
  },
});
