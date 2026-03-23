/**
 * AI Moving — Tariff Confirmation Screen
 *
 * Redesigned to match app design system:
 *   #FAFAFA bg, white cards borderRadius 16, fontFamily.primary, blue accents.
 *   Section labels inside white cards. Icons 20×20.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  StatusBarMock,
  Navbar,
} from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';
import { Tariff, TARIFFS } from './TariffSelectionScreen';

const F = fontFamily.primary;

/* ═══════════════════════════════════════════
   SVG Icons (20×20)
   ═══════════════════════════════════════════ */

const CheckCircleIcon = ({ color = colors.primary[500] }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <path d="M8 12L11 15L16 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CrossCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={colors.gray[300]} strokeWidth="1.5"/>
    <path d="M15 9L9 15M9 9L15 15" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
      fill={colors.primary[500]} fillOpacity="0.15" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="1" y="6" width="15" height="10" rx="1" stroke={colors.primary[500]} strokeWidth="1.5"/>
    <path d="M16 10H19L22 13V16H16V10Z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="6.5" cy="18" r="1.5" stroke={colors.primary[500]} strokeWidth="1.5"/>
    <circle cx="19.5" cy="18" r="1.5" stroke={colors.primary[500]} strokeWidth="1.5"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6V12C4 16.42 7.4 20.56 12 22C16.6 20.56 20 16.42 20 12V6L12 2Z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={colors.primary[500]} strokeWidth="1.5"/>
    <path d="M12 7V12L15 15" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Props
   ═══════════════════════════════════════════ */

interface TariffConfirmScreenProps {
  tariffId: string;
  estimatePrice: number;
  onConfirm: () => void;
  onBack: () => void;
  onChangePlan: () => void;
}

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */

const PriceRow: React.FC<{
  label: string; value: string; bold?: boolean; isLast?: boolean; discount?: boolean;
}> = ({ label, value, bold, isLast, discount }) => (
  <View style={[styles.priceRow, !isLast && styles.rowBorder]}>
    {Platform.OS === 'web' ? (
      <>
        <span style={{
          fontFamily: F, fontSize: 15,
          fontWeight: bold ? 600 : 400,
          color: discount ? colors.primary[600] : bold ? colors.gray[900] : colors.gray[500],
        } as any}>{label}</span>
        <span style={{
          fontFamily: F, fontSize: 15,
          fontWeight: bold ? 700 : discount ? 600 : 500,
          color: discount ? colors.primary[600] : colors.gray[900],
        } as any}>{value}</span>
      </>
    ) : (
      <>
        <Text variant="bodySm" color={discount ? colors.primary[600] : bold ? colors.gray[900] : colors.gray[500]}>{label}</Text>
        <Text variant={bold ? 'bodyMdSemibold' : 'bodySm'} color={discount ? colors.primary[600] : colors.gray[900]}>{value}</Text>
      </>
    )}
  </View>
);

const FeatureRow: React.FC<{
  label: string; included: boolean; isLast?: boolean;
}> = ({ label, included, isLast }) => (
  <View style={[styles.featureRow, !isLast && styles.rowBorder, !included && { backgroundColor: '#FAFAFA' }]}>
    <View style={styles.featureIcon}>
      {Platform.OS === 'web' && (included ? <CheckCircleIcon /> : <CrossCircleIcon />)}
    </View>
    {Platform.OS === 'web' ? (
      <span style={{
        fontFamily: F, fontSize: 15, fontWeight: included ? 500 : 400,
        color: included ? colors.gray[900] : colors.gray[400],
        flex: 1,
        ...(included ? {} : { textDecoration: 'line-through' }),
      } as any}>{label}</span>
    ) : (
      <Text variant="bodySm" color={included ? colors.gray[900] : colors.gray[400]}>{label}</Text>
    )}
  </View>
);

const NextStepRow: React.FC<{
  icon: React.FC; text: string; isLast?: boolean;
}> = ({ icon: IconComponent, text, isLast }) => (
  <View style={[styles.nextStepRow, !isLast && styles.rowBorder]}>
    <View style={styles.nextStepIconWrap}>
      {Platform.OS === 'web' && <IconComponent />}
    </View>
    {Platform.OS === 'web' ? (
      <span style={{
        fontFamily: F, fontSize: 15, fontWeight: 400,
        color: colors.gray[900], flex: 1, lineHeight: '22px',
      } as any}>{text}</span>
    ) : (
      <Text variant="bodySm" color={colors.gray[900]}>{text}</Text>
    )}
  </View>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const TariffConfirmScreen: React.FC<TariffConfirmScreenProps> = ({
  tariffId,
  estimatePrice,
  onConfirm,
  onBack,
  onChangePlan,
}) => {
  const tariff = TARIFFS.find(t => t.id === tariffId) || TARIFFS[0];
  const discount = 100;
  const totalAfterDiscount = tariff.price - discount;
  const includedFeatures = tariff.features.filter(f => f.included);
  const excludedFeatures = tariff.features.filter(f => !f.included);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock onTimeTap={onBack} />
        <Navbar title="Confirm Your Plan" onBack={onBack} />

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* ── Selected plan card ── */}
          <View style={styles.planCard}>
            {/* Top row: icon + name/desc */}
            <View style={styles.planCardInner}>
              <View style={styles.planIconWrap}>
                {Platform.OS === 'web' && <SparkleIcon />}
              </View>
              <View style={{ flex: 1 }}>
                {Platform.OS === 'web' ? (
                  <>
                    <span style={{
                      fontFamily: F, fontSize: 18, fontWeight: 700,
                      color: colors.gray[900], display: 'block',
                    } as any}>{tariff.name} Plan</span>
                    <span style={{
                      fontFamily: F, fontSize: 14, color: colors.gray[400],
                      marginTop: 2, display: 'block',
                    } as any}>{tariff.desc}</span>
                  </>
                ) : (
                  <>
                    <Text variant="h3" color={colors.gray[900]}>{tariff.name} Plan</Text>
                    <Text variant="bodySm" color={colors.gray[400]}>{tariff.desc}</Text>
                  </>
                )}
              </View>
            </View>
            {/* Price row below */}
            <View style={styles.planPriceRow}>
              {Platform.OS === 'web' ? (
                <>
                  <span style={{
                    fontFamily: F, fontSize: 28, fontWeight: 700,
                    color: colors.gray[900], letterSpacing: -0.5,
                  } as any}>${totalAfterDiscount.toLocaleString()}</span>
                  <span style={{
                    fontFamily: F, fontSize: 14, fontWeight: 500,
                    color: colors.gray[400], textDecoration: 'line-through', marginLeft: 8,
                  } as any}>${tariff.price.toLocaleString()}</span>
                </>
              ) : (
                <Text variant="h2" color={colors.gray[900]}>${totalAfterDiscount.toLocaleString()}</Text>
              )}
            </View>
          </View>

          {/* ── Price Breakdown ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: F, fontSize: 13, fontWeight: 600,
                  color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.8,
                } as any}>Price Breakdown</span>
              ) : (
                <Text variant="bodySm" color={colors.gray[400]}>PRICE BREAKDOWN</Text>
              )}
            </View>
            <PriceRow label="AI Moving Estimate" value={`$${estimatePrice.toLocaleString()}`} />
            <PriceRow label="Promo Discount" value={`-$${discount}`} discount />
            <PriceRow label="Total" value={`$${totalAfterDiscount.toLocaleString()}`} bold isLast />
          </View>

          {/* ── Included Features ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: F, fontSize: 13, fontWeight: 600,
                  color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.8,
                } as any}>What's Included</span>
              ) : (
                <Text variant="bodySm" color={colors.gray[400]}>WHAT'S INCLUDED</Text>
              )}
            </View>
            {includedFeatures.map((feat, idx) => (
              <FeatureRow
                key={feat.label}
                label={feat.label}
                included
                isLast={idx === includedFeatures.length - 1 && excludedFeatures.length === 0}
              />
            ))}
            {excludedFeatures.map((feat, idx) => (
              <FeatureRow
                key={feat.label}
                label={feat.label}
                included={false}
                isLast={idx === excludedFeatures.length - 1}
              />
            ))}
          </View>

          {/* ── What Happens Next ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: F, fontSize: 13, fontWeight: 600,
                  color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.8,
                } as any}>What Happens Next</span>
              ) : (
                <Text variant="bodySm" color={colors.gray[400]}>WHAT HAPPENS NEXT</Text>
              )}
            </View>
            <NextStepRow icon={TruckIcon} text="Your request is sent to verified movers in your area" isLast={false} />
            <NextStepRow icon={ClockIcon} text="Movers review and respond within 24 hours" isLast={false} />
            <NextStepRow icon={ShieldIcon} text="Choose your mover — all are insured & vetted" isLast />
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          {Platform.OS === 'web' ? (
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.88 }]}
            >
              <span style={{
                fontFamily: F, fontSize: 17, fontWeight: 700, color: '#fff',
              } as any}>Send to Movers</span>
            </Pressable>
          ) : (
            <Button
              title="Send to Movers"
              variant="primary"
              onPress={onConfirm}
            />
          )}
          <Pressable onPress={onChangePlan} hitSlop={12} style={({ pressed }) => [styles.changePlanBtn, pressed && { opacity: 0.7 }]}>
            {Platform.OS === 'web' ? (
              <span style={{
                fontFamily: F, fontSize: 17, fontWeight: 700,
                color: colors.primary[500], cursor: 'pointer',
              } as any}>Change plan</span>
            ) : (
              <Text variant="bodySm" color={colors.primary[500]}>Change plan</Text>
            )}
          </Pressable>
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
  },

  /* Selected plan card */
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
  } as any,
  planCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  planIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Generic card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  } as any,
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },

  /* Rows */
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 14,
  },
  featureIcon: {
    width: 20,
    height: 20,
    flexShrink: 0,
  },
  nextStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  nextStepIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },

  /* CTA */
  ctaBtn: {
    backgroundColor: colors.primary[500],
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Bottom */
  bottomContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  changePlanBtn: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: '#EFF2F7',
  },
});
